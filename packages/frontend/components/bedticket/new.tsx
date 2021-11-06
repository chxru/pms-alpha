import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
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
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

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

  const [acceptedFiles, setacceptedFiles] = useState<File[]>([]);
  const onDropAccepted = (file: File[]) => {
    // prevent duplications
    let duplicate = false;
    for (const f of acceptedFiles) {
      if (f.name == file[0].name && f.size == file[0].size) {
        duplicate = true;
        break;
      }
    }

    if (duplicate) {
      notify.NewAlert({
        status: "warning",
        msg: "Dupicate attachment",
      });
      return;
    }

    setacceptedFiles((f) => [...f, file[0]]);
  };

  const onDropRejected = () => {
    notify.NewAlert({ msg: "Only images are supported", status: "error" });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDropAccepted,
    onDropRejected,
  });

  const FetchDiagnosisTypes = async () => {
    const { success, data } = await ApiRequest<API.DiagnosisData[]>({
      path: "diagnosis",
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
      path: `bedtickets/${bid}`,
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
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
              <FormLabel>Attachments</FormLabel>
              <Flex
                {...getRootProps()}
                marginY="4"
                paddingY="4"
                paddingX="6"
                bg="gray.100"
                rounded="md"
              >
                <input {...getInputProps()} />
                <p>Drag and drop attachments here, or click to select files</p>
              </Flex>

              {acceptedFiles.length != 0 && (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Filename</Th>
                      <Th>Size</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {acceptedFiles.map((file, i) => {
                      return (
                        <Tr key={file.name + file.size}>
                          <Td>{file.name}</Td>
                          <Td>
                            {file.size < 1000000
                              ? (file.size / 1000).toFixed(1) + " KB"
                              : (file.size / 1000000).toFixed(1) + " MB"}
                          </Td>
                          <Td>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                setacceptedFiles((files) => {
                                  const temp = [...files];
                                  temp.splice(i, 1);
                                  return temp;
                                });
                              }}
                            >
                              Remove
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              )}
            </FormControl>

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
                setacceptedFiles([]);
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
