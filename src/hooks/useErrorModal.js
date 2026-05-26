import { useContext } from "react";
import { ErrorModalContext } from "../context/errorModalContextInstance";

export function useErrorModal() {
  return useContext(ErrorModalContext);
}
