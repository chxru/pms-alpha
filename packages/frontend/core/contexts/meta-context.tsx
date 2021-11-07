import { createContext } from "react";

interface Props {
  instance: "admin" | "user";
  routes: { label: string; route: string }[];
}

const MetaContext = createContext<Props>({
  instance: "user",
  routes: [],
});

export default MetaContext;
