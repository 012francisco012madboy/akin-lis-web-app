"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/view";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Exam } from "./useExamHookData";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { _axios } from "@/lib/axios";
import { Combobox } from "@/components/combobox/comboboxExam";
import { IExamProps } from "@/app/akin/schedule/types";
import { ExamCard } from "../utils/exam-history/exam-card";
import { PatientByIdProfileSkeleton } from "../utils/exam-history/patientByIdProfileSkeleton";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";

export default function ExamsHistory() {
  const { id } = useParams();
  const [namePatient, setNamePatient] = useState("");
  const [exams, setExams] = useState<IExamProps[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<IExamProps | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [isDateFilterEnabled, setIsDateFilterEnabled] = useState(false);

  const historyExams = useQuery({
    queryKey: ["exams-history"],
    queryFn: async () => {
      const response = await _axios.get<Exam>(`/exams/history/${id}`);
      return response.data;
    },
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const patientData = await _axios.get(`/pacients/${id}`);
        setNamePatient(patientData.data.nome_completo);

        const examTypes = await _axios.get("/exam-types");
        setExams(examTypes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchExams();
  }, [id]);

  useEffect(() => {
    const filtered = historyExams.data?.data.filter((exam) => {
      const isWithinDateRange =
        !isDateFilterEnabled ||
        (
          selectedDateRange &&
          isWithinInterval(new Date(exam.data_agendamento), {
            start: selectedDateRange.from!,
            end: selectedDateRange.to!,
          })
        );

      const matchesType =
        !selectedExam || exam.Tipo_Exame.nome === selectedExam.nome;

      const matchesStatus =
        !statusFilter || exam.status.toLowerCase() === statusFilter.toLowerCase();

      return isWithinDateRange && matchesType && matchesStatus;
    });
    //@ts-ignore
    setFilteredExams(filtered || []);
  }, [selectedDateRange, selectedExam, statusFilter, isDateFilterEnabled, historyExams.data]);

  const handleDateChange = (date: DateRange | Date | undefined) => {
    setSelectedDateRange(date as DateRange);
  };

  const handleSelect = (exam: IExamProps | null) => {
    setSelectedExam(exam);
  };

  const breadcrumbItems = [
    { label: "Paciente", href: "/akin/patient" },
    { label: "Perfil do paciente", href: `/akin/patient/${id}` },
    { label: "Histórico de Exame" },
  ];

  if (historyExams.isLoading || namePatient === "")
    return (
      <View.Vertical className="flex min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <PatientByIdProfileSkeleton />
      </View.Vertical>
    );

  if (historyExams.isError)
    return (
      <View.Vertical className="flex justify-center items-center min-h-screen bg-gray-50">
        <CustomBreadcrumb items={breadcrumbItems} borderB />
        <p className="text-lg text-red-500">
          Ocorreu um erro ao carregar os dados.
        </p>
      </View.Vertical>
    );

  return (
    <View.Vertical className="min-h-screen pb-5" >
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      <div className="bg-white shadow-md rounded-lg px-3  md:px-5 py-4 flex items-center">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full 
        ">
          <p className="text-md text-gray-600">
            Nome do Paciente:{" "}
            <span className="font-medium text-gray-800">{namePatient}</span>
          </p>
          <Separator orientation="vertical" />
          <div>
            <DatePickerWithRange
              enableRange={true}
              enableDateFilter={true} //Sempre permitir a filtragem de data
              //@ts-ignore
              onDateChange={handleDateChange}
              setEnableDateFilter={setIsDateFilterEnabled} // Passa a função de ativação de filtragem
            />
          </div>

          <Combobox
            data={[
              { label: "Todos", value: null },
              { label: "Pendente", value: "pendente" },
              { label: "Concluído", value: "concluido" },
              { label: "Cancelado", value: "cancelado" },
            ]}
            displayKey="label"
            onSelect={(item) => setStatusFilter(item?.value || null)}
            placeholder="Filtrar por status"
            clearLabel="Limpar"
            width="full"
          />

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
        {filteredExams && filteredExams.length > 0 ? (
          console.log("Filtered Exams", filteredExams),
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <ExamCard data={filteredExams} />
          </div>
        ) : (
          <p className="text-gray-600">Nenhum exame encontrado com os filtros aplicados.</p>
        )}
      </div>
    </View.Vertical>
  );
}
