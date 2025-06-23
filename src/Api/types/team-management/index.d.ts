interface ITeamManagement {
  id?: string;
  nome_completo?: string;
  numero_identificacao?: string;
  data_nascimento?: string;
  cargo?: string;
  contacto_telefonico?: string;
  criado_aos?: string;
  atualizado_aos?: string;
  id_sexo?: number;
  id_usuario?: string;
  id_chefe_lab?: string;
  id_unidade_saude?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  status?: string;
  nome?: string;
  usuario?: ITeamManagementToEdit;
}

interface ITeamManagementToEdit extends ITeamManagement {
  id: string;
  nome: string;
  email: string;
  hash: string;
  hashedRt: string;
  tipo: string;
  status: string;
  criado_aos: string;
  atualizado_aos: string;
}
