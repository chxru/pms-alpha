import React, { useContext, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Button, Container, Flex, Grid, GridItem, Heading, Input,Text } from "@chakra-ui/react";

import { ApiRequest } from "util/request";
import NotifyContext from "contexts/notify-context";
import AuthContext from "contexts/auth-context";

import { API } from "@pms-alpha/types";

const Search: NextPage = () => {
  const notify = useContext(NotifyContext);
  const auth = useContext(AuthContext);

  const [search, setsearch] = useState<string>("");
  const [isSearching, setisSearching] = useState<boolean>(false);
  let results: { [k: string]: any } = {};

  let result_id = new Array();

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

      data?.map((i)=>{
        results[i.id] = i.full_name
        result_id.push(i.id)
      })
  
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

        <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", lg:"repeat(3,1fr)" }}
              gap={7}
              mt="15px"
              pt="15px"
        >
          <SearchResult name={result_id[1]}></SearchResult>
          <SearchResult name="Dummy"></SearchResult>
          <SearchResult name="Dummy"></SearchResult>
          <SearchResult name="Dummy"></SearchResult>

        </Grid>
      </Container>  
    </>
  );
};

const SearchResult: React.FC<{ name: string;}> = ({ name}) => {
  return (
    <>
      <GridItem
        w="250px"
        h="50px"
        borderRadius={15}
        boxShadow="lg"
        bg="gray.100"
        align="center"
        mt={5}
        cursor="pointer"
      >
        <Text mt={2} fontWeight="semibold" >
          {name}
        </Text>
      </GridItem>
    </>
  );
};
export default Search;
