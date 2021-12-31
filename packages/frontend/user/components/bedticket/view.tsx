import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { FiExternalLink, FiFile } from "react-icons/fi";

import NewRecord from "components/bedticket/new";
import AttachmentDrawer from "components/bedticket/drawer";

import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";

import { ApiRequest } from "@pms-alpha/common/util/request";
import { ConvertTimestamp } from "@pms-alpha/common/util/time";

import { API, PGDB } from "@pms-alpha/types";

interface bedticketProps {
  bid: number;
  pid: number;
  state?: React.Dispatch<
    React.SetStateAction<PGDB.Patient.BasicDetails | undefined> // state is only passing in active bed ticket
  >;
}

const BedTicket: React.FC<bedticketProps> = ({ bid, pid, state }) => {
  const [entries, setentries] = useState<API.Bedtickets.Entries[]>([]);
  const [selectedEntry, setselectedEntry] = useState<number>(0);

  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const FetchEntries = async () => {
    const { success, err, data } = await ApiRequest<API.Bedtickets.Entries[]>({
      path: `bedtickets/${bid}`,
      method: "GET",
      token: auth.token,
    });

    if (!success || err) {
      notify.NewAlert({
        msg: "Fetching entries failed",
        description: err,
        status: "error",
      });

      return;
    }

    if (!data) {
      notify.NewAlert({
        msg: "Fetching entries failed",
        description: "Data is missing",
        status: "error",
      });

      return;
    }

    // update state
    setentries(data);
  };

  const DischargeBedticket = async () => {
    if (!state) {
      notify.NewAlert({
        msg: "Un authorized function",
        description:
          "Looks like you are discharging patient who is already discharged",
        status: "error",
      });
      return;
    }

    const { success, err } = await ApiRequest({
      path: `bedtickets/close/${pid}`,
      method: "POST",
      token: auth.token,
    });

    if (!success || err) {
      notify.NewAlert({
        msg: "Discharging failed",
        description: err,
        status: "error",
      });

      return;
    }

    notify.NewAlert({
      msg: "Patient discharged successfully",
      status: "success",
    });

    // update patient data in client side
    state((prev) =>
      prev ? { ...prev, current_bedticket: undefined } : undefined
    );
  };

  // onMount
  useEffect(() => {
    (async () => {
      await FetchEntries();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isOpen: nr_isOpen,
    onOpen: nr_onOpen,
    onClose: nr_onClose,
  } = useDisclosure();

  const {
    isOpen: ad_isOpen,
    onOpen: ad_onOpen,
    onClose: ad_onClose,
  } = useDisclosure();

  return (
    <>
      {entries.length != 0 && (
        <AttachmentDrawer
          isOpen={ad_isOpen}
          onClose={ad_onClose}
          data={entries[selectedEntry]}
        />
      )}

      <Table>
        <TableCaption>Bed ticket entries</TableCaption>

        <Thead>
          <Tr>
            <Th></Th>
            <Th>Type</Th>
            <Th>Notes</Th>
            <Th>Timestamp</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody>
          {entries.map((e, i) => {
            return (
              <Tr key={`${bid}-${i}`}>
                <Td>
                  <Badge>{e.category?.toUpperCase()}</Badge>
                </Td>
                <Td>{e.topic || "N/A"}</Td>
                <Td>{e.note || " "}</Td>
                <Td>
                  {ConvertTimestamp(e.created_at).toLocaleDateString([], {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }) +
                    " " +
                    ConvertTimestamp(e.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }) +
                    "h"}
                </Td>
                <Td>
                  <Tooltip
                    label={(e.attachments?.length || "0") + " attachments"}
                  >
                    <IconButton
                      variant="ghost"
                      aria-label="View attachments"
                      colorScheme="teal"
                      disabled={!e.attachments?.length}
                      icon={<FiFile />}
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <ButtonGroup>
                    <Tooltip label="Expand">
                      <IconButton
                        variant="ghost"
                        aria-label="View attachments"
                        colorScheme="teal"
                        icon={<FiExternalLink />}
                        onClick={() => {
                          setselectedEntry(i);
                          ad_onOpen();
                        }}
                      />
                    </Tooltip>
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {state && (
        <>
          <ButtonGroup mt={2}>
            <Button colorScheme="facebook" onClick={nr_onOpen}>
              Add New Record
            </Button>
            <Button colorScheme="orange" onClick={DischargeBedticket}>
              Discharge
            </Button>
          </ButtonGroup>
          <NewRecord
            isOpen={nr_isOpen}
            onClose={nr_onClose}
            refresh={FetchEntries}
            bid={bid}
          />
        </>
      )}
    </>
  );
};

export default BedTicket;
