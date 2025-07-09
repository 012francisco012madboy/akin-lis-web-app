interface PatientType {
  id: string;
  numero_identificacao: string;
  email?: string | null;
  nome_completo: string;
  data_nascimento: string;
  contacto_telefonico: string;
  data_registro: string;
  data_ultima_visita: string;
  id_sexo: number;
  id_usuario: string;
  sexo: sexoType;
}

interface sexoType {
  nome: string;
}
