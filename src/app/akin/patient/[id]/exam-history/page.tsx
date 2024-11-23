"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { useExamHookData } from "./useExamHookData";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { IExamProps } from "@/app/akin/schedule/new/page";
import { ___api } from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Combobox } from "@/components/combobox";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDENTE":
      return "yellow-500";
    case "CONCLUIDO":
      return "green-500";
    case "CANCELADO":
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

export default function ExamsHistory() {
  const { id } = useParams();
  const { data: patient, loading, error } = useExamHookData(id);

  const [namePatient, setNamePatient] = useState("")
  const [exams, setExams] = useState<IExamProps[]>([])
  const [selectedExam, setSelectedExam] = useState<IExamProps | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const patientNome = await ___api.get<PatientType>(`/pacients/${id}`);
        setNamePatient(patientNome.data.nome);

        const response = await ___api.get("/exam-types")
        setExams(response.data.data)
      } catch (error) {
        console.error("Error fetching exams:", error)
      }
    }
    fetchExams()
  }, [id])

  const handleSelect = (exam: IExamProps | null) => {
    console.log("Selected exam:", exam)
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

      <div className="bg-white shadow-md rounded-lg px-5 py-4 flex items-center">
        <div className="flex h-5 items-center justify-between space-x-4 text-sm w-full">
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
          />
          <Separator orientation="vertical" />
          <Combobox
            data={exams}
            displayKey="nome"
            onSelect={handleSelect}
            placeholder="Selecionar exame"
            clearLabel="Limpar"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
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
      </div>
    </View.Vertical>

  );
}