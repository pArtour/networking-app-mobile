import { createContext } from "react";
import { User } from "../utils/types";

export const MeContext = createContext<{ me: User }>(null);