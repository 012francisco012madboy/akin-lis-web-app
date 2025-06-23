interface ExamsType {
  id: number;
  preco: number;
  id_tecnico_alocado: string | null,
  status: string,
  data_agendamento: string;
  hora_agendamento: string;
  data_formatada: Date
  status_pagamento: string;
  criado_aos: Date,
  atualizado_aos: Date,
  id_agendamento: number;
  id_tipo_Exame: number;
  Tipo_Exame: Tipo_Exame;
}

interface Tipo_Exame {
  id: number,
  nome: string,
  descricao: string,
  preco: number,
  status: string,
  criado_aos: Date,
  atualizado_aos: Date
}

interface AvaliableExamsType {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}


// "Exame": [
//   {
//     "id": 10,
//     // "id_tecnico_alocado": null,
//     // "status": "PENDENTE",
//     // "data_agendamento": "2024-12-24",
//     // "hora_agendamento": "14:30",
//     // "data_formatada": "2024-12-24T14:30:00.000Z",
//     // "status_pagamento": "PENDENTE",
//     // "criado_aos": "2024-11-28T13:26:47.324Z",
//     // "atualizado_aos": "2024-11-28T13:26:47.324Z",
//     // "id_agendamento": 9,
//     // "id_tipo_exame": 1,
//     "Tipo_Exame": {
//       "id": 1,
//       "nome": "Covid-19",
//       "descricao": "...",
//       "preco": 5000,
//       "status": "DISPONIVEL",
//       "criado_aos": "2024-11-27T21:42:31.792Z",
//       "atualizado_aos": "2024-11-27T21:42:31.792Z"
//     }
//   }
// ]