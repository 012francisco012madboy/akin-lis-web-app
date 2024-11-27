

export interface IExamProps {
  id: string | number;
  nome: string;
  descricao?: string;
  preco?: string;
  status?: "DISPONÍVEL" | "INDISPONÍVEL"
}

export type Patient = {
  id: string;
  nome: string;
  data_nascimento?: string;
  sexo: {
    nome: string
  };
  contacto_telefonico?: string;
  numero_identificacao?: string
};

export type GenderOption = {
  id: number;
  value: string
};
