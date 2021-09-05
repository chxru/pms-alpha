import React, { useContext, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import LoginPage from "./login";

import Sidebar from "../components/sidebar";
import Overlay from "../components/overlay";

import AuthContext from "../contexts/auth-context";
import NotifyContext from "../contexts/notify-context";

import type { API } from "types/api";

function MyApp({ Component, pageProps }: AppProps) {
  const notify = useContext(NotifyContext);

  const [accessToken, setaccessToken] = useState<string>();
  const [userData, setuserData] = useState<API.Auth.UserData>();
  const onSignIn = (token: string, user: API.Auth.UserData) => {
    setaccessToken(token);
    setuserData(user);
  };
  const onSignOut = () => {
    setaccessToken(undefined);
    setuserData({
      id: -1,
      fname: "",
      lname: "",
      username: "",
    });
  };

  const RefreshAccessToken = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const { success, err, data } = (await res.json()) as API.Response<{
          access_token: string;
          user: API.Auth.UserData;
        }>;

        if (!success) {
          notify.NewAlert({
            msg: "Error occured while refreshing token",
            description: err,
            status: "info",
          });
        }

        if (data?.access_token) {
          setaccessToken(data.access_token);
        }
        if (data?.user) {
          setuserData(data.user);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const onMount = async () => {
    await RefreshAccessToken();

    // refresh access token for every 15mins
    setInterval(async () => {
      await RefreshAccessToken();
    }, 1000 * 60 * 15);
  };

  // onMount
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{ token: accessToken, user: userData, onSignIn, onSignOut }}
      >
        <Overlay>
          {!!accessToken ? (
            <Sidebar>
              <Component {...pageProps} />
            </Sidebar>
          ) : (
            <LoginPage />
          )}
        </Overlay>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
