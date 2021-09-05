/* eslint-disable no-unused-vars */
import React from "react";
import type { API } from "types/api";

const AuthContext = React.createContext<{
  user?: API.Auth.UserData;
  token?: string;
  onSignIn: (token: string, user: API.Auth.UserData) => void;
  onSignOut: () => void;
}>({
  onSignIn: () => {},
  onSignOut: () => {},
});

export default AuthContext;
