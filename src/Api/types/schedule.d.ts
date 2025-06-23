interface ScheduleType {
  id: number;
  id_paciente: string;
  id_unidade_de_saude: number;
  data_agendamento: string;
  hora_agendamento: string;
  status: string;
  id_tecnico_alocado: number|null;//after remove null
  data_pagamento: string|null //after remove null;
  Exame: ExamsType[];
  Paciente:PatientType
}


// {
//   "id": 9,
//   "id_paciente": "cm41agqyl000nqqnupvw3bv2v",
//   "id_unidade_de_saude": 1,
//   "id_recepcionista": null,
//   "id_chefe_alocado": null,
//   "status": "CONCLUIDO",
//   "criado_aos": "2024-11-28T13:26:46.345Z",
//   "atualizado_aos": "2024-11-28T13:26:46.345Z",
//   "Exame": [
//       {
//           "id": 10,
//           "id_tecnico_alocado": null,
//           "status": "PENDENTE",
//           "data_agendamento": "2024-12-24",
//           "hora_agendamento": "14:30",
//           "data_formatada": "2024-12-24T14:30:00.000Z",
//           "status_pagamento": "PENDENTE",
//           "criado_aos": "2024-11-28T13:26:47.324Z",
//           "atualizado_aos": "2024-11-28T13:26:47.324Z",
//           "id_agendamento": 9,
//           "id_tipo_exame": 1,
//           "Tipo_Exame": {
//               "id": 1,
//               "nome": "Covid-19",
//               "descricao": "...",
//               "preco": 5000,
//               "status": "DISPONIVEL",
//               "criado_aos": "2024-11-27T21:42:31.792Z",
//               "atualizado_aos": "2024-11-27T21:42:31.792Z"
//           }
//       }
//   ],
//   "Paciente": {
//       "id": "cm41agqyl000nqqnupvw3bv2v",
//       "id_usuario": null,
//       "numero_identificacao": "006048225LM144",
//       "nome": "Mário Paul",
//       "data_nascimento": "2006-06-21",
//       "contacto_telefonico": "922366274",
//       "data_ultima_visita": null,
//       "id_sexo": 1,
//       "criado_aos": "2024-11-28T12:26:23.070Z",
//       "atualizado_aos": "2024-11-28T12:26:23.070Z",
//       "sexo": {
//           "nome": "Masculino"
//       }
//   }
// }