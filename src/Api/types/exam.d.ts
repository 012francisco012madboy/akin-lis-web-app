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
