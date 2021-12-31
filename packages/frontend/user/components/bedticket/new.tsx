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

import type { API } from "@pms-alpha/types";
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

  const [selectedType, setselectedType] = useState<string>();
  const [diagnosisCategories, setdiagnosisCategories] = useState<string[]>();
  const [diagnosisData, setdiagnosisData] = useState<API.Diagnosis.Data[]>();
  const [selectedDiagnose, setselectedDiagnose] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<API.Bedtickets.Entries, "created_at">>();

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
    const { success, data } = await ApiRequest<API.Diagnosis.Data[]>({
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

    const categories = new Set<string>();
    data?.forEach((d) => categories.add(d.category));

    setdiagnosisCategories([...categories]);
    setdiagnosisData(data);
  };

  const OnSubmit = async (value: API.Bedtickets.Entries) => {
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
      // TODO: unnecessary loop?
      obj.topic =
        diagnosisData?.find((d) => d.name == selectedDiagnose)?.id.toString() ||
        obj.topic;
    }

    const formData = new FormData();

    for (const file of acceptedFiles) {
      formData.append("files", file);
    }

    formData.append("category", obj.category);
    if (obj.note) formData.append("note", obj.note);
    if (obj.topic) formData.append("topic", obj.topic);

    const { success, err } = await ApiRequest({
      path: `bedtickets/${bid}`,
      method: "POST",
      obj: formData,
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
              {errors.category && (
                <FormHelperText>This field is required</FormHelperText>
              )}
            </FormControl>

            {selectedType === "diagnosis" && diagnosisData?.length ? (
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
                    {diagnosisCategories?.map((cat) => (
                      <AutoCompleteGroup key={`cat-${cat}`} showDivider>
                        <AutoCompleteGroupTitle>{cat}</AutoCompleteGroupTitle>
                        {diagnosisData
                          ?.filter((d) => d.category === cat)
                          .map((data) => (
                            <AutoCompleteItem
                              key={`item-${data.id}`}
                              value={data.name}
                              textTransform="capitalize"
                            >
                              {data.name}
                            </AutoCompleteItem>
                          ))}
                      </AutoCompleteGroup>
                    ))}
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
