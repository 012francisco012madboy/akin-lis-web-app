"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { ModalNewPatient } from "./components/ModalNewPatient";
import { ___api } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { schemaSchedule } from "./schemaZodNewPatient";
import { IExamProps, Patient } from "../types";
import { PatientDetails } from "./components/PatientDetails";
import { ScheduleDetails } from "./components/ScheduleDetails";
import { Button } from "@/components/ui/button";

export type SchemaScheduleType = z.infer<typeof schemaSchedule>;

const DEFAULT_USER = { id: "cm27g9oa00001lg20jnnzb0wr", name: "João Silva", id_unidade_de_saude: 1 };

export default function New() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableExams, setAvailableExams] = useState<IExamProps[]>([]);
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  const [patientAutoComplete, setPatientAutoComplete] = useState<{ value: string; id: string }[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [schedules, setSchedules] = useState([{ exam: "", date: new Date(), time: "" }]);

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

  const validateSchedule = () => {
    const errors: string[] = [];
    const today = new Date();

    // Validação de horários
    schedules.forEach((schedule, index) => {
      if (!schedule.exam) {
        errors.push(`Exame não selecionado para o agendamento ${index + 1}`);
      }

      const scheduleDateTime = new Date(`${schedule.date}T${schedule.time}`);
      if (scheduleDateTime < today) {
        errors.push(`A data e hora do agendamento ${index + 1} devem ser futuras.`);
      }
    });

    if (!selectedPatient) {
      errors.push("Nenhum paciente selecionado.");
    }

    if (errors.length > 0) {
      ___showErrorToastNotification({ messages: errors });
      return { isValid: false };
    }

    return {
      isValid: true,
      data: {
        id_paciente: selectedPatient!.id,
        id_unidade_de_saude: 1, // Exemplo de unidade
        agendamentos: schedules.map((schedule) => ({
          exame: schedule.exam,
          data: schedule.date,
          hora: schedule.time,
        })),
      },
    };
  };

  const handleSubmit = async () => {
    const validation = validateSchedule();

    if (!validation.isValid) return;
    console.log(validation.data)
    
    // validation.data?.agendamentos.map((e)=>{
    //   console.log(e.data)
    // })

    // setIsSaving(true);
    // try {
    //   const response = await ___api.post("/schedulings/set-schedule", validation.data);
    //   if (response.status === 201) {
    //     ___showSuccessToastNotification({ message: "Agendamento marcado com sucesso" });
    //     setSchedules([{ exam: "", date: new Date(), time: "" }]);
    //     setSelectedPatient(undefined);
    //   } else {
    //     ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Tente novamente." });
    //   }
    // } catch (error) {
    //   ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Contate o suporte." });
    // } finally {
    //   setIsSaving(false);
    // }
  };

  return (
    <div className="min-h-screen px-6 py-2 pb-5 bg-gray-50">
      {/* Cabeçalho */}
      <div className={"flex flex-col md:flex-row justify-between pr-3 mb-4"}>
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">Novo Agendamento</h1>
        <ModalNewPatient onPatientSaved={handleSavePatient} />
      </div>

      {/* Formulário */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-6 w-full"
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

          <div className="p-4 bg-gray-100 rounded-lg border flex flex-col">
            <ScheduleDetails
              isLoading={isLoading}
              exams={availableExams}
              schedules={schedules}
              onChange={setSchedules}
            />
          </div>
        </div>

        <Button type="submit">
          Agendar
        </Button>
      </form>
    </div>
  );
}