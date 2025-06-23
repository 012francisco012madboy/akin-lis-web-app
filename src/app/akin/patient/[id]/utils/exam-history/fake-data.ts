import { IExamProps } from "@/module/types";


export const examsFilter: IExamProps[] = [
  {
    id: "1",
    nome: 'Exames Realizados',
  },
  {
    id: "2",
    nome: 'Exames Pendentes',
  },
  {
    id: "3",

    nome: 'Exames Cancelados',
  },
]

export const patient = {
  data: [
    {
      id: 1,
      id_agendamento: 101,
      id_tipo_Exame: 2,
      status: 'Concluído',
      exame: {
        id: 1,
        nome: 'Ultrassonografia Abdominal',
        descricao: 'Exame de imagem para avaliação da cavidade abdominal.',
        preco: 250.00,
        status: 'Disponível',
      },
      _count: {
        Protocolo_Exame: 2,
        Utilizacao_Material: 3,
      },
      Agendamento: {
        id: 101,
        id_paciente: '12345',
        id_tecnico_alocado: 'T001',
        id_unidade_de_saude: 1,
        data_agendamento: '2024-11-15',
        hora_agendamento: '10:30',
        status: 'Finalizado',
        status_pagamento: 'Pago',
        quantia_pagamento: 250.00,
        data_pagamento: '2024-11-15',
        data_formatada: '15/11/2024 10:30',
      },
    },
    {
      id: 2,
      id_agendamento: 102,
      id_tipo_Exame: 1,
      status: 'Concluído',
      exame: {
        id: 2,
        nome: 'Ressonância Magnética',
        descricao: 'Exame de imagem para avaliação detalhada das estruturas internas.',
        preco: 1200.00,
        status: 'Disponível',
      },
      _count: {
        Protocolo_Exame: 1,
        Utilizacao_Material: 2,
      },
      Agendamento: {
        id: 102,
        id_paciente: '67890',
        id_tecnico_alocado: 'T002',
        id_unidade_de_saude: 2,
        data_agendamento: '2024-11-18',
        hora_agendamento: '14:00',
        status: 'Finalizado',
        status_pagamento: 'Pago',
        quantia_pagamento: 1200.00,
        data_pagamento: '2024-11-18',
        data_formatada: '18/11/2024 14:00',
      },
    },
    {
      id: 3,
      id_agendamento: 103,
      id_tipo_Exame: 3,
      status: 'Concluído',
      exame: {
        id: 3,
        nome: 'Eletrocardiograma',
        descricao: 'Exame para avaliar a atividade elétrica do coração.',
        preco: 150.00,
        status: 'Disponível',
      },
      _count: {
        Protocolo_Exame: 3,
        Utilizacao_Material: 1,
      },
      Agendamento: {
        id: 103,
        id_paciente: '11223',
        id_tecnico_alocado: 'T003',
        id_unidade_de_saude: 3,
        data_agendamento: '2024-11-20',
        hora_agendamento: '09:00',
        status: 'Finalizado',
        status_pagamento: 'Pago',
        quantia_pagamento: 150.00,
        data_pagamento: '2024-11-20',
        data_formatada: '20/11/2024 09:00',
      },
    },
    {
      id: 4,
      id_agendamento: 104,
      id_tipo_Exame: 4,
      status: 'Pendente',
      exame: {
        id: 4,
        nome: 'Tomografia Computadorizada',
        descricao: 'Exame de imagem utilizado para detectar doenças e condições no corpo.',
        preco: 1500.00,
        status: 'Indisponível',
      },
      _count: {
        Protocolo_Exame: 0,
        Utilizacao_Material: 0,
      },
      Agendamento: {
        id: 104,
        id_paciente: '33445',
        id_tecnico_alocado: null,
        id_unidade_de_saude: 4,
        data_agendamento: '2024-11-22',
        hora_agendamento: '11:30',
        status: 'Pendente',
        status_pagamento: 'Pendente',
        quantia_pagamento: 1500.00,
        data_pagamento: null,
        data_formatada: '22/11/2024 11:30',
      },
    },
  ],
};