import React from "react";
import {
  Container,
  Heading,
  Flex,
  Input,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

const SearchDiagnosis: React.FC = () => {
  return (
    <Container maxW="4xl" mt="28px" px="35px" py="21px" shadow="md" bg="white">
      <Heading my="20px" size="md" fontWeight="semibold">
        Search diagnosis
      </Heading>

      <Flex>
        <Input placeholder="Enter name..." />
        <Button w={48} ml={4}>
          Search
        </Button>
      </Flex>

      <Table variant="simple" mt={7}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Edit</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td>25.4</Td>
          </Tr>
        </Tbody>
      </Table>
    </Container>
  );
};

export default SearchDiagnosis;
