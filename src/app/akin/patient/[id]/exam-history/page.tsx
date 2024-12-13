"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Exam, useExamHookData } from "./useExamHookData";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { _axios } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox } from "@/components/combobox";
import { IExamProps } from "@/app/akin/schedule/types";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pendente":
      return "yellow-500";
    case "concluído":
      return "green-500";
    case "cancelado":
      return "red-500";
    default:
      return "gray-500";
  }
};
const PatientByIdProfileSkeleton = () => {
  return (
    <div className="w-full h-full space-y-5">
      <Skeleton className="w-full h-12 bg-gray-500/20" />
      <Skeleton className="w-full h-[500px] bg-gray-500/20" />
    </div>
  )
}

const examsFilter: IExamProps[] = [
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

const patient = {
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

export default function ExamsHistory() {
  const { id } = useParams();
  const { loading, error } = useExamHookData(id);

  const [namePatient, setNamePatient] = useState("")
  const [exams, setExams] = useState<IExamProps[]>([])
  const [selectedExam, setSelectedExam] = useState<IExamProps | null>(null)

  

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const patientNome = await _axios.get<PatientType>(`/pacients/${id}`);
        setNamePatient(patientNome.data.nome_completo);

        const response = await _axios.get("/exam-types")
        setExams(response.data.data)
      } catch (error) {
        console.error("Error fetching exams:", error)
      }
    }
    fetchExams()
  }, [id])

  const handleSelect = (exam: IExamProps | null) => {
    // console.log("Selected exam:", exam)
    setSelectedExam(exam)
  }

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Histórico de Exame" },
  ];

  if (loading || namePatient == "")
    return (
      <View.Vertical className="flex min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <PatientByIdProfileSkeleton />
      </View.Vertical>
    );

  if (error)
    return (
      <View.Vertical className="flex justify-center items-center min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <p className="text-lg text-red-500">Erro: {error}</p>
      </View.Vertical>
    );

  return (

    <View.Vertical className=" min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="bg-white shadow-md rounded-lg px-3 md:px-5 py-4 flex items-center">
        <div className="flex flex-col gap-3 h-max lg:h-5 lg:flex-row lg:items-center lg:justify-between items-start  space-x-4 text-sm w-full">
          <p className="text-md text-gray-600">
            Nome do Paciente:{" "}
            <span className="font-medium text-gray-800">
              {namePatient}
            </span>
          </p>
          <Separator orientation="vertical" />
          <Combobox
            data={examsFilter}
            displayKey="nome"
            onSelect={handleSelect}
            placeholder="Exames Realizados"
            clearLabel="Limpar"
            width="full"
          />
          <Separator orientation="vertical" />
          <Combobox
            data={exams}
            displayKey="nome"
            onSelect={handleSelect}
            placeholder="Selecionar exame"
            clearLabel="Limpar"
            width="full"
          />
        </div>
      </div>

      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Exames Realizados</h2>
        {patient!.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient!.data.map((value, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {value.exame.nome}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Descrição: <span className="font-medium">{value.exame.descricao}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Data do Agendamento:{" "}
                  <span className="font-medium">{value.Agendamento.data_agendamento}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Hora:{" "}
                  <span className="font-medium">{value.Agendamento.hora_agendamento}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Unidade de Saúde:{" "}
                  <span className="font-medium">{value.Agendamento.id_unidade_de_saude}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Técnico Alocado:{" "}
                  <span className="font-medium">
                    {value.Agendamento.id_tecnico_alocado || "Não alocado"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Status do Exame:{" "}
                  <span className={`font-medium text-${getStatusColor(value.status)}`}>
                    {value.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Status do Pagamento:{" "}
                  <span
                    className={`font-medium text-${getStatusColor(
                      value.Agendamento.status_pagamento
                    )}`}
                  >
                    {value.Agendamento.status_pagamento}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Valor Pago:{" "}
                  <span className="font-medium">
                    {value.Agendamento.quantia_pagamento.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            Nenhum exame encontrado para este paciente.
          </p>
        )}
      </div> */}
      <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Exames Realizados
        </h2>
        {patient.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <ExamCard data={patient.data} />

          </div>
        ) : (
          <p className="text-gray-600">Nenhum exame realizado ainda.</p>
        )}
      </div>
    </View.Vertical>

  );
}


const ExamCard: React.FC<Exam> = ({ data }) => (
  data.map((exame) => (
    <div key={exame.id} className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{exame.exame.nome}</h3>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Descrição: <span className="font-medium">{exame.exame.descricao}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Data do Agendamento:{" "}
        <span className="font-medium">{exame.Agendamento.data_agendamento}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Hora: <span className="font-medium">{exame.Agendamento.hora_agendamento}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Unidade de Saúde:{" "}
        <span className="font-medium">{exame.Agendamento.id_unidade_de_saude}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Técnico Alocado:{" "}
        <span className="font-medium">
          {exame.Agendamento.id_tecnico_alocado || "Não alocado"}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Status do Exame:{" "}
        <span className={`font-medium text-${getStatusColor(exame.status)}`}>
          {exame.status}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Status do Pagamento:{" "}
        <span
          className={`font-medium text-${getStatusColor(
            exame.Agendamento.status_pagamento
          )}`}
        >
          {exame.Agendamento.status_pagamento}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Valor Pago:{" "}
        <span className="font-medium">
          {exame.Agendamento.status_pagamento}
        </span>
      </p>
    </div>
  ))

);