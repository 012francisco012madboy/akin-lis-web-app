import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/Api/axios.config";

interface ExamHistoryFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  patientId?: string;
  examType?: string;
}

export const useExamHistory = (filters: ExamHistoryFilters = {}) => {
  return useQuery({
    queryKey: ["exam-history", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }

      if (filters.dateFrom) {
        params.append('date_from', filters.dateFrom);
      }

      if (filters.dateTo) {
        params.append('date_to', filters.dateTo);
      }

      if (filters.patientId) {
        params.append('patient_id', filters.patientId);
      }

      if (filters.examType) {
        params.append('exam_type', filters.examType);
      }

      const response = await _axios.get(`/exams/history?${params.toString()}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Mock data para desenvolvimento
export const mockExamHistory: ExamsType[] = [
  {
    id: 1,
    status: "CONCLUIDO",
    data_agendamento: "2024-01-15",
    hora_agendamento: "09:00",
    data_formatada: "2024-01-15T09:00:00.000Z",
    duracao: null,
    status_pagamento: "PAGO",
    criado_aos: "2024-01-14T00:00:00.000Z",
    atualizado_aos: "2024-01-15T00:00:00.000Z",
    id_agendamento: 1,
    id_tipo_exame: 1,
    id_tecnico_alocado: "TEC001",
    Tipo_Exame: {
      id: 1,
      nome: "Hemograma Completo",
      preco: 150.00
    },
    Tecnico_Laboratorio: {
      id: "TEC001",
      nome: "Dr. João Silva",
      email: "joao@exemplo.com",
      hash: "",
      hashedRt: "",
      tipo: "TECNICO",
      status: "ATIVO",
      criado_aos: "2024-01-01T00:00:00.000Z",
      atualizado_aos: "2024-01-01T00:00:00.000Z",
      id_unidade_saude: "OSA2025",
      Tecnico_Laboratorio: []
    },
    Agendamento: {
      id: 1,
      id_paciente: 1,
      id_unidade_de_saude: "OSA2025",
      id_recepcionista: null,
      id_chefe_alocado: null,
      status: "CONCLUIDO",
      criado_aos: "2024-01-14T00:00:00.000Z",
      atualizado_aos: "2024-01-15T00:00:00.000Z",
      Paciente: {
        id: 1,
        nome_completo: "Maria Silva",
        id_sexo: 2
      },
      Chefe_Laboratorio: null
    }
  },
  {
    id: 2,
    status: "CONCLUIDO",
    data_agendamento: "2024-01-14",
    hora_agendamento: "10:30",
    data_formatada: "2024-01-14T10:30:00.000Z",
    duracao: null,
    status_pagamento: "PAGO",
    criado_aos: "2024-01-13T00:00:00.000Z",
    atualizado_aos: "2024-01-14T00:00:00.000Z",
    id_agendamento: 2,
    id_tipo_exame: 2,
    id_tecnico_alocado: "TEC002",
    Tipo_Exame: {
      id: 2,
      nome: "Glicemia de Jejum",
      preco: 80.00
    },
    Tecnico_Laboratorio: {
      id: "TEC002",
      nome: "Dr. Ana Santos",
      email: "ana@exemplo.com",
      hash: "",
      hashedRt: "",
      tipo: "TECNICO",
      status: "ATIVO",
      criado_aos: "2024-01-01T00:00:00.000Z",
      atualizado_aos: "2024-01-01T00:00:00.000Z",
      id_unidade_saude: "OSA2025",
      Tecnico_Laboratorio: []
    },
    Agendamento: {
      id: 2,
      id_paciente: 2,
      id_unidade_de_saude: "OSA2025",
      id_recepcionista: null,
      id_chefe_alocado: null,
      status: "CONCLUIDO",
      criado_aos: "2024-01-13T00:00:00.000Z",
      atualizado_aos: "2024-01-14T00:00:00.000Z",
      Paciente: {
        id: 2,
        nome_completo: "João Santos",
        id_sexo: 1
      },
      Chefe_Laboratorio: null
    }
  },
  {
    id: 3,
    status: "CANCELADO",
    data_agendamento: "2024-01-13",
    hora_agendamento: "14:00",
    data_formatada: "2024-01-13T14:00:00.000Z",
    duracao: null,
    status_pagamento: "NAO_PAGO",
    criado_aos: "2024-01-12T00:00:00.000Z",
    atualizado_aos: "2024-01-13T00:00:00.000Z",
    id_agendamento: 3,
    id_tipo_exame: 3,
    id_tecnico_alocado: "TEC001",
    Tipo_Exame: {
      id: 3,
      nome: "Urina Tipo I",
      preco: 120.00
    },
    Tecnico_Laboratorio: {
      id: "TEC001",
      nome: "Dr. João Silva",
      email: "joao@exemplo.com",
      hash: "",
      hashedRt: "",
      tipo: "TECNICO",
      status: "ATIVO",
      criado_aos: "2024-01-01T00:00:00.000Z",
      atualizado_aos: "2024-01-01T00:00:00.000Z",
      id_unidade_saude: "OSA2025",
      Tecnico_Laboratorio: []
    },
    Agendamento: {
      id: 3,
      id_paciente: 3,
      id_unidade_de_saude: "OSA2025",
      id_recepcionista: null,
      id_chefe_alocado: null,
      status: "CANCELADO",
      criado_aos: "2024-01-12T00:00:00.000Z",
      atualizado_aos: "2024-01-13T00:00:00.000Z",
      Paciente: {
        id: 3,
        nome_completo: "Ana Costa",
        id_sexo: 2
      },
      Chefe_Laboratorio: null
    }
  }
];
