import React, { useContext, useState } from "react";
import { Container, Heading, Box, Button } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";
import { ApiRequest } from "@pms-alpha/common/util/request";

const ImportDiagnosis: React.FC = () => {
  const auth = useContext(AuthContext);
  const notify = useContext(NotifyContext);

  const [acceptedFile, setacceptedFile] = useState<File>();
  const onDropAccepted = (file: File[]) => {
    setacceptedFile(file[0]);
  };

  const onDropRejected = () => {
    notify.NewAlert({ msg: "Only csv files are supported", status: "error" });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    multiple: false,
  });

  const onSubmit = async () => {
    if (!acceptedFile) {
      notify.NewAlert({ msg: "acceptedFile is empty", status: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", acceptedFile);

    const { success, err } = await ApiRequest({
      path: "diagnosis/import",
      method: "POST",
      obj: formData,
      token: auth.token,
    });

    if (!success) {
      notify.NewAlert({
        msg: "Importing diagnosis types failed",
        description: err,
        status: "error",
      });
      return;
    }

    notify.NewAlert({
      msg: "Importing success",
      status: "success",
    });

    setacceptedFile(undefined);
  };

  return (
    <Container
      maxW="4xl"
      mt="28px"
      mb={10}
      px="35px"
      py="21px"
      shadow="md"
      bg="white"
    >
      <Heading my="20px" size="md" fontWeight="semibold">
        Import file
      </Heading>

      <Box
        {...getRootProps()}
        marginY="4"
        paddingY="4"
        paddingX="6"
        bg="gray.100"
        rounded="md"
      >
        <input {...getInputProps()} />
        <p>
          {acceptedFile?.name ??
            "Drag and drop diagnosis csv file, or click to select files"}
        </p>
      </Box>

      <Button
        w={48}
        colorScheme="teal"
        disabled={!acceptedFile?.name}
        onClick={onSubmit}
      >
        Import
      </Button>
    </Container>
  );
};

export default ImportDiagnosis;
