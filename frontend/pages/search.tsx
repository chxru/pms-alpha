import React, { useContext, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Button, Container, Flex, Heading, Input } from "@chakra-ui/react";

import { ApiRequest } from "util/request";
import NotifyContext from "contexts/notify-context";
import AuthContext from "contexts/auth-context";

import { API } from "@pms-alpha/types";

const Search: NextPage = () => {
  const notify = useContext(NotifyContext);
  const auth = useContext(AuthContext);

  const [search, setsearch] = useState<string>("");
  const [isSearching, setisSearching] = useState<boolean>(false);

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

      // TODO: Handle search results
      console.info(data);
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
    </>
  );
};

export default Search;
