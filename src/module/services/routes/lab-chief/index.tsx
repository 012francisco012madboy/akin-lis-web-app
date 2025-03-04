import { _axios } from "@/lib/axios";

interface Usuario {
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

interface LabChief {
  id: string;
  numero_identificacao: string;
  nome_completo: string;
  data_nascimento: string;
  cargo: string;
  contacto_telefonico: string;
  criado_aos: string;
  atualizado_aos: string;
  id_sexo: number;
  id_usuario: string;
  id_unidade_saude: string;
  usuario: Usuario;
}


class LabChiefRoutes {

  async getAllLabChief() {
   const response = await _axios.get<LabChief[]>("/lab-chiefs");
   return response.data;
  }

}

export const labChiefRoutes = new LabChiefRoutes();