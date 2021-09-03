import React from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import Sidebar from "../components/sidebar";
import Overlay from "../components/overlay";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Overlay>
        <Sidebar>
          <Component {...pageProps} />
        </Sidebar>
      </Overlay>
    </ChakraProvider>
  );
}

export default MyApp;
