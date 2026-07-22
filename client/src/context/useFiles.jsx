import { useContext } from "react";
import { FileContext } from "./FileContext";
//this gives things and which place to where to use it(this function allows where to use that saved state or saved finction above fuction stored)
export const useFiles = () => {
  return useContext(FileContext);
}