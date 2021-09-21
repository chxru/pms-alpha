import React from "react";
import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";

const RegisterPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>PMS-alpha </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex height="100vh" align="center" justify="center">
        <Text fontSize="2xl" fontWeight="semibold" align="center">
          PMS-Alpha haven't configured yet.
          <br />
          Contact admin
        </Text>
      </Flex>
    </>
  );
};

export default RegisterPage;
