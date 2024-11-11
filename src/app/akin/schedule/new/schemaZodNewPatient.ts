import { z } from "zod";


export const schemaSchedule = z.object({
  patient_id: z.string().regex(/^\d{9}[A-Z]{2}\d{3}$/, {
    message: "Número de Bilhete de Identidade inválido",
  }),

  patient_name: z
    .string({ required_error: "Campo de 'nome' obrigatorio" })
    .min(5, "O nome deve ter pelo menos mais de 5 caracter")
    .regex(/^[a-zA-ZÀ-ú\s]+$/, "Apenas é permitido Letras no Nome"),

  patient_phone: z
    .string()
    .regex(/^[0-9]*$/, "Só é permitido números para o campo de Nº de Telemóvel")
    .length(9, "Você precisa ter nove (9) digitos no Nº de Telemóvel"),

  patient_birth_day: z
    .date({
      required_error: "Data de nascimento é obrigatório",
      invalid_type_error: "Data de nascimento é obrigatório",
    })
    .max(new Date(), "A data nascimento não pode ser superior ao dia de hoje."),
  patient_gender: z.enum(["Masculino", "Feminino"], {
    errorMap: () => ({ message: "Apenas é permitido Masculino ou Feminino" }),
  }),
});