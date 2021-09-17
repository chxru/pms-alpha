import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import Head from "next/head";

import NotifyContext from "contexts/notify-context";
import AuthContext from "contexts/auth-context";

import type { API } from "@pms-alpha/types";

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [authenticating, setauthenticating] = useState<boolean>(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginForm>();
  const notify = useContext(NotifyContext);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // return to main page if an access token is already available
    if (!!authContext.token) {
      router.push("/");
    }
  }, [authContext.token, router]);

  // form submit
  const onSubmit = async (values: LoginForm) => {
    setauthenticating(true);

    try {
      const request = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(values),
      });

      if (!request.ok) {
        const { err } = (await request.json()) as API.Response;

        notify.NewAlert({
          msg: "User authentication failed",
          description: err,
          status: "error",
        });

        return;
      }

      notify.NewAlert({ msg: "User authenticated", status: "success" });

      const { data } =
        (await request.json()) as API.Response<API.Auth.LoginResponse>;

      if (!data?.access || !data.user) {
        notify.NewAlert({
          msg: "User authentication failed",
          description: "Empty response",
          status: "error",
        });
        return;
      }

      router.push("/").then(() => {
        authContext.onSignIn(data.access, data.user);
      });
    } catch (error) {
      if (typeof error === "string") {
        notify.NewAlert({
          msg: "Error occured",
          description: error,
          status: "error",
        });
      } else {
        notify.NewAlert({
          msg: "Something is wrong",
          status: "error",
        });
      }
    } finally {
      setauthenticating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center w="100vw" h="100vh">
        <Container width="350px">
          <Text align="center" paddingY="2" fontSize="lg">
            Login
          </Text>
          <Box
            backgroundColor="white"
            paddingY="2"
            paddingX="4"
            boxShadow="lg"
            rounded="lg"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  {...register("username", { required: true })}
                  placeholder="username"
                />
                {errors.username && (
                  <FormHelperText>This field is required</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  {...register("password", { required: true })}
                  placeholder="password"
                  type="password"
                />
                {errors.password && (
                  <FormHelperText>This field is required</FormHelperText>
                )}
              </FormControl>

              <Flex direction="column">
                <Button
                  type="submit"
                  m="2"
                  colorScheme="teal"
                  isLoading={authenticating}
                >
                  Login
                </Button>
                <Button m="2" size="sm">
                  Forgot my password
                </Button>
              </Flex>
            </form>
          </Box>
        </Container>
      </Center>
    </>
  );
};

export default LoginPage;
