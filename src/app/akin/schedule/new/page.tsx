"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import AutoComplete from "@/components/auto-complete";
import { View } from "@/components/view";
import { CheckBoxExam } from "./components/CheckBoxExam";
import { ModalNewPatient } from "./components/ModalNewPatient";
import { ___api } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { schemaSchedule } from "./schemaZodNewPatient";

// Types
interface INew { }
export type SchemaScheduleType = z.infer<typeof schemaSchedule>;
type Patient = { id: string; nome: string; data_nascimento?: string; sexo: { nome: string }; contacto_telefonico?: string; numero_identificacao?: string };
type Exam = { id: number; nome: string };
type GenderOption = { id: number; value: string };
export interface IExamProps {
  id: string | number;
  nome: string;
  descricao?: string;
  preco?: string;
  status?: "DISPONÍVEL" | "INDISPONÍVEL"
}

// Constants
const GENDERS: GenderOption[] = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
];
const DEFAULT_USER = { id: "cm27g9oa00001lg20jnnzb0wr", name: "João Silva", id_unidade_de_saude: 1 };

export default function New({ }: INew) {
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
      } else {
        ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Tente novamente." });
      }
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao marcar agendamento. Contate o suporte." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen px-4">
      <h1 className="font-light text-3xl my-6">Novo Agendamento</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex flex-wrap w-full gap-3">
        <div className="flex flex-col flex-1 gap-5">
          <PatientDetails
            isLoading={isLoading}
            selectedPatient={selectedPatient}
            autoCompleteData={patientAutoComplete}
            onPatientSelect={setSelectedPatientId}
          />
          <ScheduleDetails />
        </div>
        <ExamSelection exams={availableExams} isLoading={isLoading} isSaving={isSaving} />
      </form>
    </div>
  );
}

// Extracted Components
function PatientDetails({ isLoading, selectedPatient, autoCompleteData, onPatientSelect }: {
  isLoading: boolean,
  selectedPatient: Patient | undefined,
  onPatientSelect: (value: string) => void,
  autoCompleteData: {
    value: string;
    id: string;
  }[]
}) {
  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <p className="flex items-center">
          <LoaderCircle className="animate-spin mr-2" /> Carregando lista de pacientes...
        </p>
      ) : (
        <div className="flex border-2 border-akin-yellow-light rounded-lg bg-akin-yellow-light/20 ring-0 relative">
          <AutoComplete
            placeholder={selectedPatient?.nome || "Nome completo do paciente"}
            name="name"
            lookingFor="paciente"
            dataFromServer={autoCompleteData}
            setSelectedItemId={onPatientSelect}
          />
          <ModalNewPatient />
        </div>
      )}
      <PatientInfo patient={selectedPatient} />
    </div>
  );
}

function PatientInfo({ patient }: {
  patient: Patient | undefined
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Input.CalenderDate disabled noUseLabel placeholder="Data de Nascimento" maxDate={new Date()} valueDate={patient?.data_nascimento ? new Date(patient.data_nascimento) : null} />
      <Input.Dropdown disabled data={GENDERS} name="gender" placeholder="Sexo" valueData={patient?.sexo.nome} />
      <Input.InputText placeholder="Contacto telefónico" name="phone_number" value={patient?.contacto_telefonico} disabled />
      <Input.InputText placeholder="Bilhete de Identidade" name="identity" value={patient?.numero_identificacao} disabled />
    </div>
  );
}

function ScheduleDetails() {
  return (
    <div>
      <h2 className="font-bold">Data do Agendamento</h2>
      <hr />
      <div className="flex gap-2 mt-4">
        <Input.CalenderDate valueDate={new Date()} minDate={new Date()} name="schedule_date" />
        <Input.CalenderTime name="schedule_time" />
      </div>
    </div>
  );
}

function ExamSelection({ exams, isLoading, isSaving }: {
  exams: IExamProps[],
  isLoading: boolean,
  isSaving: boolean
}) {
  return (
    <div className="h-[29rem] w-[15rem] flex flex-col border-2 border-akin-yellow-light rounded-lg bg-akin-yellow-light/20">
      <div className="space-y-4 flex-1 p-2">
        <div className="space-y-2 model p-4 h-[24rem]">
          <h1 className="font-bold text-xl -mx-4">Exames Disponíveis</h1>
          <View.Scroll className="max-h-full overflow-y-auto space-y-2 h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <ProgressSpinner style={{ width: "25px", height: "25px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".4s" />
              </div>
            ) : (
              exams.map((v) => (
                <CheckBoxExam key={v.id} id={v.id} nome={v.nome} />
              ))
            )}
          </View.Scroll>
        </div>
      </div>
      <div className="mt-4 px-4 mb-5">
        <Button.Primary className="m-2" type="submit" label={isSaving ? "Marcando..." : "Agendar"} disabled={isSaving} />
      </div>
    </div>
  );
}