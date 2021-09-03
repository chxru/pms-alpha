import React from "react";
import { useToast } from "@chakra-ui/react";

import NotifyContext from "../contexts/notify-context";

const Overlay: React.FC = ({ children }) => {
  const toast = useToast();
  const newAlert = ({
    msg,
    status = "success",
    description,
  }: {
    msg: string;
    status: "success" | "error" | "warning" | "info";
    description?: string;
  }) => {
    toast({
      title: msg,
      status,
      isClosable: true,
      position: "bottom-right",
      description,
    });
  };

  return (
    <NotifyContext.Provider value={{ NewAlert: newAlert }}>
      <div style={{ width: "100vw", height: "100vh" }}>{children}</div>
    </NotifyContext.Provider>
  );
};

export default Overlay;
