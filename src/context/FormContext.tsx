// /context/FormContext.tsx
import { createContext, useContext, useState } from "react";

export type FormDataType = {
  nome: string;
  email: string;
  senha: string;
  tipo: "TECNICO" | "CHEFE" | "RECEPCIONISTA";
  status: string;
  id_unidade_saude: string;
  nome_completo: string;
  data_nascimento: string;
  numero_identificacao: string;
  id_sexo: number;
  cargo: string;
  contacto_telefonico: string;
};

const defaultValues: FormDataType = {
  nome: "",
  email: "",
  senha: "",
  tipo: "TECNICO",
  status: "ATIVO",
  id_unidade_saude: "",
  nome_completo: "",
  data_nascimento: "",
  numero_identificacao: "",
  id_sexo: 1,
  cargo: "",
  contacto_telefonico: "",
};

const FormContext = createContext<{
  data: FormDataType;
  setData: React.Dispatch<React.SetStateAction<FormDataType>>;
}>({
  data: defaultValues,
  setData: () => {},
});

export const useFormData = () => useContext(FormContext);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<FormDataType>(defaultValues);
  return (
    <FormContext.Provider value={{ data, setData }}>
      {children}
    </FormContext.Provider>
  );
};
