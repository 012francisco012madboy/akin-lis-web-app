


export const genders = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
]; 

export const mapFormDataToPatient = (data: FormData) => ({
  numero_identificacao: data.get("identity") as string,
  nome_completo: data.get("name") as string,
  email: data.get("email") as string,
  data_nascimento: new Date(data.get("birth_day") as string).toLocaleDateString("en-CA"),
  contacto_telefonico: data.get("phone_number") as string,
  id_sexo: genders.find((gender) => gender.value === data.get("gender") as string)?.id,
});