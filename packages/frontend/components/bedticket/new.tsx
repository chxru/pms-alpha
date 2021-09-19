import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";

import { ApiRequest } from "@pms-alpha/common/util/request";

import type { API, PGDB } from "@pms-alpha/types";
import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

interface newProps {
  isOpen: boolean;
  onClose: () => void;
  bid?: number;
  refresh: () => Promise<void>;
}

const NewRecord: React.FC<newProps> = ({ isOpen, onClose, bid, refresh }) => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const [diagnoisisArr, setdiagnoisisArr] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedType, setselectedType] = useState<string>();
  const [selectedDiagnose, setselectedDiagnose] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<PGDB.Patient.BedTicketEntry, "created_at">>();

  const FetchDiagnosisTypes = async () => {
    const { success, data } = await ApiRequest<API.DiagnosisData[]>({
      path: "/diagnosis",
      method: "GET",
      token: auth.token,
    });

    if (!success) {
      notify.NewAlert({
        msg: "Error occured while fetching diagnosis data",
        status: "error",
      });
      return;
    }

    // holds values temp before updating state
    const temp: {
      [key: string]: string[];
    } = {};

    data?.forEach((d) => {
      if (!temp[d.category]) {
        temp[d.category] = [d.name];
      } else {
        temp[d.category].push(d.name);
      }
    });

    setdiagnoisisArr(temp);
  };

  const OnSubmit = async (value: PGDB.Patient.BedTicketEntry) => {
    let obj = value;
    if (value.category === "diagnosis") {
      if (!selectedDiagnose) {
        notify.NewAlert({
          msg: "Invalid form data",
          description: "Diagnose type shouldn't be empty",
          status: "error",
        });
        return;
      }
      obj.type = selectedDiagnose;
    }

    const { success, err } = await ApiRequest({
      path: `/bedtickets/${bid}`,
      method: "POST",
      obj,
      token: auth.token,
    });

    if (!success) {
      notify.NewAlert({
        msg: "Invalid form data",
        description: err,
        status: "error",
      });
      return;
    }

    notify.NewAlert({
      msg: "New entry record saved",
      status: "success",
    });

    // refetch entries
    // TODO: combine with add new request
    await refresh();

    reset();

    onClose();
  };

  useEffect(() => {
    setselectedType(undefined);
    FetchDiagnosisTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Add New Entry</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(OnSubmit)}>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Entry type</FormLabel>
              <Select
                placeholder="Select record type"
                {...register("category", { required: true })}
                onChange={(v) => {
                  setselectedType(v.target.value.toLocaleLowerCase());
                }}
              >
                <option value="diagnosis">Diagnosis</option>
                <option value="report">Report</option>
                <option value="other">Other</option>
              </Select>
              {errors.type && (
                <FormHelperText>This field is required</FormHelperText>
              )}
            </FormControl>

            {selectedType === "diagnosis" &&
            Object.entries(diagnoisisArr).length ? (
              <FormControl>
                <FormLabel>Diagnosis type</FormLabel>
                <AutoComplete
                  openOnFocus
                  onChange={(v) =>
                    setselectedDiagnose(typeof v === "string" ? v : "N/A")
                  }
                >
                  <AutoCompleteInput variant="filled" />
                  <AutoCompleteList>
                    {Object.entries(diagnoisisArr).map(
                      ([category, diagnosis], c_id) => (
                        <AutoCompleteGroup key={c_id} showDivider>
                          <AutoCompleteGroupTitle textTransform="capitalize">
                            {category}
                          </AutoCompleteGroupTitle>
                          {diagnosis.map((d, d_id) => (
                            <AutoCompleteItem
                              key={d_id}
                              value={d}
                              textTransform="capitalize"
                            >
                              {d}
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteGroup>
                      )
                    )}
                  </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            ) : (
              <FormHelperText>Loading</FormHelperText>
            )}

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea {...register("note")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="facebook" mr={3}>
              Submit
            </Button>
            <Button
              type="reset"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewRecord;
