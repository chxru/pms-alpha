import React, { useContext, useState } from "react";
import Head from "next/head";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { ApiRequest } from "@pms-alpha/common/util/request";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";
import AuthContext from "@pms-alpha/common/contexts/auth-context";

import type { NextPage } from "next";
import type { API } from "@pms-alpha/types";

const Search: NextPage = () => {
  const notify = useContext(NotifyContext);
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [search, setsearch] = useState<string>("");
  const [isSearching, setisSearching] = useState<boolean>(false);
  const [results, setresults] = useState<API.Patient.SearchDetails[]>([]);

  const HandleSearch = async () => {
    setisSearching(true);

    try {
      const { success, err, data } = await ApiRequest<
        API.Patient.SearchDetails[]
      >({
        path: "patients/search",
        method: "POST",
        obj: { search },
        token: auth.token,
      });

      if (!success || err) {
        notify.NewAlert({
          msg: "Search results wasn't success",
          description: err,
          status: "error",
        });
      }

      setresults(data || []);
    } catch (error) {
      notify.NewAlert({
        msg: "Error occured while fetching search results",
        status: "error",
      });
      console.error(error);
    } finally {
      setisSearching(false);
    }
  };

  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="description" content="Profile View" />
      </Head>

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
          Search by name
        </Heading>

        <Flex>
          <Input
            placeholder="Enter name..."
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
          <Button
            w={48}
            ml={4}
            isLoading={isSearching}
            loadingText="Searching"
            onClick={HandleSearch}
          >
            Search
          </Button>
        </Flex>
      </Container>

      {results.length !== 0 && (
        <Container
          maxW="4xl"
          mb={10}
          px="35px"
          py="21px"
          shadow="md"
          bg="white"
        >
          <Table variant="simple">
            <TableCaption>Search result</TableCaption>
            <Thead>
              <Tr>
                <Th>id</Th>
                <Th>Name</Th>
                <Th>Options</Th>
              </Tr>
            </Thead>
            <Tbody>
              {results.map((r) => (
                <Tr key={r.uuid}>
                  <Td>{r.uuid}</Td>
                  <Td>{r.full_name}</Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      onClick={() => {
                        router.push(`/patient/${r.uuid}`);
                      }}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}></Grid>
        </Container>
      )}
    </>
  );
};

export default Search;
