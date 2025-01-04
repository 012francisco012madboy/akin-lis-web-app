"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Exam, useExamHookData } from "./useExamHookData";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { _axios } from "@/lib/axios";
import { Combobox } from "@/components/combobox/comboboxExam";
import { IExamProps } from "@/app/akin/schedule/types";
import { ExamCard } from "../utils/exam-history/exam-card";
import { examsFilter, patient } from "../utils/exam-history/fake-data";
import { PatientByIdProfileSkeleton } from "../utils/exam-history/patientByIdProfileSkeleton";
import { useQuery } from "@tanstack/react-query";

export default function ExamsHistory() {
  const { id } = useParams();
  const { loading, error } = useExamHookData(id);
  const [namePatient, setNamePatient] = useState("")
  const [exams, setExams] = useState<IExamProps[]>([])
  const [selectedExam, setSelectedExam] = useState<IExamProps | null>(null)

  const historyExams = useQuery({ 
    queryKey: ["exams-history"],
    queryFn: async () => {
      const response = await _axios.get<Exam>(`/exams/history/${id}`);
      return response.data;
    }
  });

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
    setSelectedExam(exam)
  }

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Histórico de Exame" },
  ];

  if (loading || namePatient == ""  || historyExams.isLoading) 
    return (
      <View.Vertical className="flex min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <PatientByIdProfileSkeleton />
      </View.Vertical>
    );

  if (error || historyExams.isError)
    return (
      <View.Vertical className="flex justify-center items-center min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <p className="text-lg text-red-500">Ocorreu um erro ao carregar os dados</p>
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
      <div className="bg-white shadow-md rounded-lg p-6 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Exames Realizados
        </h2>
        {patient.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExamCard data={historyExams.data!.data} />
          </div>
        ) : (
          <p className="text-gray-600">Nenhum exame realizado ainda.</p>
        )}
      </div>
    </View.Vertical>
  );
}