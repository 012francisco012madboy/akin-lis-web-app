// /services/mutation.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "./api";
import { FormDataType } from "../context/FormContext";

export const useSubmitForm = () => {
  return useMutation({
    mutationFn: async (data: FormDataType) => {
      let endpoint = "";

      if (data.tipo === "TECNICO") endpoint = "/lab-technicians";
      else if (data.tipo === "CHEFE") endpoint = "/lab-chiefs";
      else if (data.tipo === "RECEPCIONISTA") endpoint = "/receptionist";

      return api.post(endpoint, data);
    },
  });
};
