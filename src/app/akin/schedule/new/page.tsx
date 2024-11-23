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
import { Skeleton } from "@/components/ui/skeleton";

// Types
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
    if(resetAllInputsAfterSchedule) resetAllInputsAfterSchedule.value="";
    if (nameInput){
      nameInput.value=""
      nameInput.placeholder= "Nome completo do paciente"
    }
  };

  return (
<div className="min-h-screen px-6 py-2 bg-gray-50">
  {/* Cabeçalho */}

  <div className={"flex flex-col md:flex-row w-[70%] justify-between"}>
  <h1 className="text-2xl font-semibold text-gray-800 mb-3">Novo Agendamento</h1>
  <ModalNewPatient  onPatientSaved={handleSavePatient}/>

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

// Extracted Components
function PatientDetails({ isLoading, selectedPatient, onPatientSelect,autoCompleteData}: {
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
        <div className="flex justify-between gap-5  w-[650px] ">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-12" />
        </div>
      ) : (
        <div className="flex rounded-lg gap-5 ">
          <AutoComplete
            placeholder={selectedPatient?.nome || "Nome completo do paciente"}
            name="name"
            lookingFor="paciente"
            dataFromServer={autoCompleteData}
            setSelectedItemId={onPatientSelect}
            className="w-full "
          />
          {/* <ModalNewPatient  onPatientSaved={handleSavePatient}/> */}
        </div>
      )}
      <PatientInfo patient={selectedPatient} isLoading={isLoading} />
    </div>
  );
}

function PatientInfo({ patient, isLoading }: {
  patient: Patient | undefined,
  isLoading: boolean
}) {
  return (
    <div className="flex flex-nowrap gap-2 ">
      {
        isLoading ? (
          <div className="w-full space-y-3">
            <Skeleton className="w-full h-[250px]" />
          </div>
        ) : (
          <div className="space-y-6 w-full p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <Input.CalenderDate
              disabled
              noUseLabel
              placeholder="Data de Nascimento"
              maxDate={new Date()}
              valueDate={patient?.data_nascimento ? new Date(patient.data_nascimento) : null}
              className="flex-1 lg:w-[400px] bg-gray-100 rounded-md"
            />
            <Input.Dropdown
              disabled
              data={GENDERS}
              name="gender"
              placeholder="Sexo"
              valueData={patient?.sexo.nome}
              className="flex-1 bg-gray-100"
            />
          </div>
        
          <Input.InputText
            placeholder="Contacto Telefónico"
            id="text"
            name="phone_number"
            value={patient?.contacto_telefonico}
            disabled
            className="w-full bg-gray-100 border-none "
          />
        
          <Input.InputText
            placeholder="Bilhete de Identidade"
            name="identity"
            value={patient?.numero_identificacao}
            disabled
            className="w-full bg-gray-100 border-none"
          />
        </div>
        )
      }
    </div>
  );
}

function ScheduleDetails({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-200 space-y-4">
      {/* Título */}
      <h2 className="font-semibold text-lg text-gray-800">Detalhes do Agendamento</h2>
      <hr className="border-gray-300" />

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex w-[400px] gap-4 mt-4">
          <Skeleton className="w-full h-12 rounded-md" />
          <Skeleton className="w-full h-12 rounded-md" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <Input.CalenderDate
            valueDate={new Date()}
            minDate={new Date()}
            name="schedule_date"
            className="flex-1 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input.CalenderTime
            name="schedule_time"
            className="flex-1 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}

function ExamSelection({ exams, isLoading, isSaving }: { exams: IExamProps[]; isLoading: boolean; isSaving: boolean }) {
  return (
    <div className="h-[29rem] w-[16rem] flex flex-col rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Cabeçalho */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-xl text-gray-800">Exames Disponíveis</h1>
      </div>

      {/* Conteúdo */}    
      <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : exams.length > 0 ? (
          exams.map((exam) => (
            <CheckBoxExam
              key={exam.id}
              id={exam.id}
              nome={exam.nome}
              status={exam.status}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">Nenhum exame disponível</div>
        )}
      </div>

      {/* Botão de ação */}
      <div className="p-4 border-t">
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${
            isSaving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition-all duration-200`}
          disabled={isSaving}
        >
          {isSaving ? "Marcando..." : "Agendar"}
        </button>
      </div>
    </div>
  );
}
