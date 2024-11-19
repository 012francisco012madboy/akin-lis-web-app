import { useEffect, useState } from "react";
import { ___api } from "@/lib/axios";

export interface Exam {
  data: {
    id: number;
    id_agendamento: number;
    id_tipo_Exame: number;
    status: string;
    exame: {
      id: number;
      nome: string;
      descricao: string;
      preco: number;
      status: string;
    };
    _count: {
      Protocolo_Exame: number;
      Utilizacao_Material: number;
    };
    agendamento: Appointment;
  }[]
}

export interface Appointment {
  id: number;
  id_paciente: string;
  id_tecnico_alocado: string | null;
  id_unidade_de_saude: number;
  data_agendamento: string;
  hora_agendamento: string;
  status: string;
  status_pagamento: string;
  quantia_pagamento: number;
  data_pagamento: string | null;
  data_formatada: string;
}

interface ExamHistory {
  Agendamento: Appointment;
  id: number;
  status: string;
  exame: Exam;
}

export function useExamHookData(id: string | string[]) {
  const [data, setData] = useState<Exam>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ___api.get<Exam>(`/exams/history/${id}`);
        console.log("Resposta da API:", response.data); // Primeiro console
        setData(response.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // Efeito para monitorar mudanças no estado "data"
  useEffect(() => {
    console.log("Dados atualizados:", data); 
    
    data?.data.map((v) => {
      console.log("Exame: " + v.exame.nome)
    })
  }, [data]);

  return { data, loading, error };
}
