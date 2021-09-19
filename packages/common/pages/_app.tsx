import React, { useContext, useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import LoginPage from "@pms-alpha/common/pages/login";

import Sidebar from "@pms-alpha/common/components/sidebar";
import Overlay from "@pms-alpha/common/components/overlay";
import Splash from "@pms-alpha/common/components/splash";

import AuthContext from "@pms-alpha/common/contexts/auth-context";
import NotifyContext from "@pms-alpha/common/contexts/notify-context";

import type { AppProps } from "next/app";
import type { API } from "@pms-alpha/types";

function MyApp({
  Component,
  pageProps,
}: Pick<AppProps, "Component" | "pageProps">) {
  const notify = useContext(NotifyContext);

  const [loading, setloading] = useState<boolean>(true);
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
    setloading(false);

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
          {loading ? (
            <Splash />
          ) : !!accessToken ? (
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
