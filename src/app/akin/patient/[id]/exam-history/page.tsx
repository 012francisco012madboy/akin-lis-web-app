"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Exam, useExamHookData } from "./useExamHookData";

export default function ExamsHistory() {
  const { id } = useParams();
  const { data: patient, loading, error } = useExamHookData(id);

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Histórico de Exame" },
  ];

  if (loading)
    return (
      <View.Vertical className="flex justify-center items-center min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <p className="text-lg text-gray-500">Carregando histórico de exames...</p>
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

    <View.Vertical className="p-6 bg-gray-100 min-h-screen">
      <CustomBreadcrumb items={breadcrumbItems} borderB />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Exames</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Informações do Paciente
        </h2>
        <p className="text-md text-gray-600 mb-4">
          Nome do Paciente:{" "}
          <span className="font-medium text-gray-800">
            {"Nome não disponível"}
          </span>
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Exames Realizados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patient?.data.map((value, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Exame: {value.exame.nome}
              </h3>
              <p className="text-sm text-gray-600">Descrição: {value.exame.descricao}</p>
              <p className="text-sm text-gray-600">
                Data do Agendamento: {value.Agendamento.data_agendamento}
              </p>
              <p className="text-sm text-gray-600">Status: {value.status}</p>
              <p className="text-sm text-gray-600">
                Status do Pagamento: {" " + value.Agendamento.status_pagamento}
              </p>
            </div>
          ))}
        </div>

        {patient?.data.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Nenhum exame encontrado para este paciente.
          </p>
        )}
      </div>
    </View.Vertical>
  );
}