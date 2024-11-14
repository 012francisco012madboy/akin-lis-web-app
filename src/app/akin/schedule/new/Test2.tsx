"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { DialogWindow } from "@/components/dialog";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import AutoComplete from "@/components/auto-complete";
import { LoaderCircle, Save, UserRoundPlus } from "lucide-react";

import { View } from "@/components/view";
import { CheckBoxExam } from "./components/CheckBoxExam";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { ___api } from "@/lib/axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { schemaSchedule } from "./schemaZodNewPatient";

const genders = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
];

export type SchemaScheduleType = z.infer<typeof schemaSchedule>;

const fetchPatients = async () => {
  try {
    const res = await ___api.get("pacients");
    return res.data.map((patient: PatientType) => ({
      value: patient.nome,
      id: patient.id,
    }));
  } catch (error) {
    ___showErrorToastNotification({ message: "Erro ao carregar pacientes" });
    return [];
  }
};

const fetchExams = async () => {
  try {
    const res = await ___api.get("/exam-types");
    return res.data.data;
  } catch (error) {
    ___showErrorToastNotification({ message: "Erro ao carregar exames" });
    return [];
  }
};

function PatientForm({ availablePatientsAutoComplete, selectedPatient, setSelectedPatient, setWindowDialog }) {
  return (
    <div className="flex flex-col gap-5">
      <AutoComplete
        placeholder={selectedPatient?.nome || "Nome completo do paciente"}
        name="name"
        lookingFor="paciente"
        className="border-0 ring-0 flex-1"
        dataFromServer={availablePatientsAutoComplete}
        setSelectedItemId={(id) => setSelectedPatient(id)}
      />
      <Input.CalenderDate disabled noUseLabel placeholder="Data de Nascimento" name="birth_day" maxDate={new Date()} valueDate={selectedPatient?.data_nascimento} />
      <Input.Dropdown data={genders} name="gender" placeholder="Selecione o sexo" valueData={selectedPatient?.sexo.nome} />
      <div className="absolute p-2 rounded-lg -top-12 right-0 flex items-center cursor-pointer" onClick={() => setWindowDialog(true)}>
        <UserRoundPlus />
        <p>Registar Novo Paciente</p>
      </div>
    </div>
  );
}

function ExamList({ avaliableExams, isLoading }) {
  return (
    <View.Scroll className="max-h-full overflow-y-auto space-y-2 h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <ProgressSpinner style={{ width: "25px", height: "25px" }} strokeWidth="8" />
        </div>
      ) : avaliableExams.length === 0 ? (
        <p className="text-gray-400">Não há exames disponíveis</p>
      ) : (
        avaliableExams.map((exam, index) => <CheckBoxExam key={index} description={exam.nome} value={String(exam.id)} />)
      )}
    </View.Scroll>
  );
}

function ScheduleForm({ onSubmit }) {
  return (
    <form action={onSubmit} className="flex flex-wrap w-full gap-3">
      <div className="flex flex-col flex-1 gap-5">
        <PatientForm {...props} />
        <div>
          <h2 className="font-bold">Data do Agendamento</h2>
          <hr />
          <div className="flex gap-2 mt-4">
            <Input.CalenderDate valueDate={new Date()} minDate={new Date()} name="schedule_date" />
            <Input.CalenderTime name="schedule_time" />
          </div>
        </div>
      </div>
      <ExamList {...props} />
      <Button.Primary type="submit" label="Agendar" />
    </form>
  );
}

export default function New() {
  const [windowDialog, setWindowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avaliableExams, setAvaliableExams] = useState([]);
  const [availablePatientsAutoComplete, setAvailablePatientsAutoComplete] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState();

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      const patients = await fetchPatients();
      setAvailablePatientsAutoComplete(patients);
      const exams = await fetchExams();
      setAvaliableExams(exams);
      setIsLoading(false);
      ___showSuccessToastNotification({ message: "Dados obtidos com sucesso!" });
    };
    loadData();
  }, []);

  return (
    <div className="h-screen px-4">
      <h1 className="font-light text-3xl my-6">Novo Agendamento</h1>
      <ScheduleForm
        onSubmit={(data) => {
          // Passar lógica de envio para dentro da ScheduleForm e demais subcomponentes
        }}
      />
      <DialogWindow.Window modalTitle="Confirmação" visible={windowDialog} setVisible={setWindowDialog}>
        <PatientForm {...props} />
      </DialogWindow.Window>
    </div>
  );
}
