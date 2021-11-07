import React from "react";
import { Container, Heading, Flex, Input, Button } from "@chakra-ui/react";

const ImportDiagnosis: React.FC = () => {
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

      <Flex>
        <Input placeholder="Name" type="file" accept=".json" mr={4} />
        <Button w={48} ml={4} colorScheme="teal">
          Import
        </Button>
      </Flex>
    </Container>
  );
};

export default ImportDiagnosis;
