/* eslint-disable no-unused-vars */
import React from "react";

const NotifyContext = React.createContext<{
  NewAlert: ({
    msg,
    status,
    description,
  }: {
    msg: string;
    status: "success" | "error" | "warning" | "info";
    description?: string;
  }) => void;
}>({
  NewAlert: () => {},
});

export default NotifyContext;
