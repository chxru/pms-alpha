import { createContext } from "react";

const MetaContext = createContext<{ instance: "admin" | "user" }>({
  instance: "user",
});

export default MetaContext;
