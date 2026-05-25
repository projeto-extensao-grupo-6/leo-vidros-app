import { createContext } from "react";

export const ErrorModalContext = createContext({
  showApiError: () => {},
  closeError: () => {},
});
