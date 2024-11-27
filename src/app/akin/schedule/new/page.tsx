"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { ModalNewPatient } from "./components/ModalNewPatient";
import { ___api } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { schemaSchedule } from "./schemaZodNewPatient";
import { Skeleton } from "@/components/ui/skeleton";
import { IExamProps, Patient } from "../types";
import { PatientDetails } from "./components/PatientDetails";
import { ScheduleDetails } from "./components/ScheduleDetails";
import { ExamSelection } from "./components/ExamCheckSelection";

// Types
export type SchemaScheduleType = z.infer<typeof schemaSchedule>;

type Exam = { id: number; nome: string };

const DEFAULT_USER = { id: "cm27g9oa00001lg20jnnzb0wr", name: "João Silva", id_unidade_de_saude: 1 };

export default function New() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableExams, setAvailableExams] = useState<IExamProps[]>([]);
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  const [patientAutoComplete, setPatientAutoComplete] = useState<{ value: string; id: string }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [loggedUser] = useState(DEFAULT_USER);


  useEffect(() => {
    fetchPatientsAndExams();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      setSelectedPatient(availablePatients.find((patient) => patient.id === selectedPatientId));
    }
  }, [selectedPatientId, availablePatients]);

  const fetchPatientsAndExams = async () => {
    try {
      const patientsResponse = await ___api.get("pacients");
      const patientsData = patientsResponse.data.map((patient: Patient) => ({ value: patient.nome, id: patient.id }));
      setPatientAutoComplete(patientsData);
      setAvailablePatients(patientsResponse.data);

      const examsResponse = await ___api.get("/exam-types");
      setAvailableExams(examsResponse.data.data);

      ___showSuccessToastNotification({ message: "Dados obtidos com sucesso!" });
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao buscar dados" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatient = (patient: Patient) => {
    setPatientAutoComplete((prev) => [...prev, { value: patient.nome, id: patient.id }]);
    setAvailablePatients((prev) => [...prev, patient]);
    setSelectedPatient(patient);
  };

  const validateSchedule = (data: FormData) => {
    const scheduleDate = data.get("schedule_date") as string;
    const scheduleTime = data.get("schedule_time") as string;

    const selectedExams = Array.from(document.querySelectorAll('input[name="checkbox"]:checked')).map(
      (checkbox) => Number((checkbox as HTMLInputElement).value.split("_")[0])
    );
    const errors = [];
    if (!selectedExams.length) errors.push("Selecione pelo menos um exame");

    const today = new Date();
    const scheduleDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduleDateTime < today) errors.push("A data e hora do agendamento devem ser futuras.");

    if (errors.length > 0) {
      ___showErrorToastNotification({ messages: errors });
      return { isValid: false };
    }

    return {
      isValid: true,
      data: {
        id_paciente: selectedPatient!.id,
        id_unidade_de_saude: loggedUser.id_unidade_de_saude,
        data_agendamento: scheduleDate.replace(/\//g, "-"),
        hora_agendamento: scheduleTime,
        exames_paciente: selectedExams.map((id) => ({ id })),
      },
    };
  };

  const handleSubmit = async (data: FormData) => {
    const validation = validateSchedule(data);

    if (!validation.isValid) return;

    setIsSaving(true);
    try {
      const response = await ___api.post("/schedulings/set-schedule", validation.data);

      if (response.status === 201) {
        ___showSuccessToastNotification({ message: "Agendamento marcado com sucesso" });
        setSelectedPatient(undefined);
        resetForm();
      } else {
        ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Tente novamente." });
      }
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Contate o suporte." });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    // Limpar checkboxes
    const checkboxes = document.querySelectorAll('input[name="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => (checkbox.checked = !checkbox.checked));

    // Resetar os campos de data e hora
    const identityInput = document.querySelector('input[name="identity"]') as HTMLInputElement;
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;

    const resetAllInputsAfterSchedule = document.querySelector('input[id="text"]') as HTMLInputElement;

    if (identityInput) identityInput.value = "";
    if (resetAllInputsAfterSchedule) resetAllInputsAfterSchedule.value = "";
    if (nameInput) {
      nameInput.value = ""
      nameInput.placeholder = "Nome completo do paciente"
    }
  };

  return (
    <div className="min-h-screen px-6 py-2 bg-gray-50">
      {/* Cabeçalho */}
      <div className={"flex flex-col md:flex-row w-[70%] justify-between"}>
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Novo Agendamento</h1>
        <ModalNewPatient onPatientSaved={handleSavePatient} />

      </div>

      {/* Formulário */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
        className="flex flex-col lg:flex-row gap-6  w-full p-2 justify-between"
      >
        {/* Detalhes do Paciente e Data */}
        <div className="flex flex-col gap-6 w-full ">

          <div className="p-4 bg-gray-100 rounded-lg border w-full">
            <PatientDetails
              isLoading={isLoading}
              selectedPatient={selectedPatient}
              autoCompleteData={patientAutoComplete}
              onPatientSelect={(patientId) => setSelectedPatientId(patientId)}
            />
          </div>

          <div className="p-4 bg-gray-100 rounded-lg border">
            <ScheduleDetails isLoading={isLoading} />
          </div>
        </div>

        {/* Seleção de Exames */}
        <div className="w-full lg:w-[20rem]">
          <ExamSelection exams={availableExams} isLoading={isLoading} isSaving={isSaving} />
        </div>
      </form>
    </div>
  );
}