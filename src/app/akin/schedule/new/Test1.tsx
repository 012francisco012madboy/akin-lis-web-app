



"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import AutoComplete from "@/components/auto-complete";
import { LoaderCircle } from "lucide-react";

import { View } from "@/components/view";
import { CheckBoxExam } from "./components/CheckBoxExam";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { ___api } from "@/lib/axios";
import { ProgressSpinner } from "primereact/progressspinner";
import { schemaSchedule } from "./schemaZodNewPatient";
import { ModalNewPatient } from "./components/ModalNewPatient";

interface INew { }

const genders = [
  { id: 1, value: "Masculino" },
  { id: 2, value: "Feminino" },
];

export type SchemaScheduleType = z.infer<typeof schemaSchedule>;

export default function New({ }: INew) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avaliableExams, setAvaliableExams] = useState<AvaliableExamsType[]>([]);
  const [availablePatients, setAvailablePatients] = useState<PatientType[]>([]);
  const [availablePatientsAutoComplete, setAvailablePatientsAutoComplete] = useState<{ value: string; id: string }[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<PatientType>();
  //TODO Get user on localSorage
  const [loggedUser, setLoggedUser] = useState({ id: "cm27g9oa00001lg20jnnzb0wr", name: "João Silva", id_unidade_de_saude: 1 });

  useEffect(() => {
    ___api
      .get("pacients")
      .then((res) => {
        const pacients = res.data.map((pacient: PatientType) => {
          return {
            value: pacient.nome,
            id: pacient.id,
          };
        });
        setAvailablePatientsAutoComplete(pacients);
        setAvailablePatients(res.data);
      })
      .finally(() => {
        ___api
          .get("/exam-types")
          .then((res) => {
            setAvaliableExams(res.data.data);
            setIsLoading(false);
            ___showSuccessToastNotification({ message: "Dados obtidos com sucesso!" });
          })
          .catch((e) => {
            ___showErrorToastNotification({ message: "Erro inesperado ocorreu ao buscar os dados" });
          });
      });
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      const patientFinded = availablePatients.find((patient) => patient.id === selectedItemId);

      // console.log("BOMMM ", patientFinded);
      setSelectedPatient(patientFinded);
    }
  }, [selectedItemId, availablePatients]);

  function actionAfterSavePatient(patientResponse: PatientType) {
    console.log("BOMMM-- ", patientResponse);

    setAvailablePatientsAutoComplete((prev) => [
      ...prev,
      {
        value: patientResponse.nome,
        id: patientResponse.id,
      },
    ]);

    setAvailablePatients((prev) => [...prev, patientResponse]);

    setSelectedPatient(patientResponse);

    // setWindowDialog(false);
  }

  async function onSubmitFn(data: FormData) {
    let patient_name = data.get("name") as string;

    const patient_schedule_time = data.get("schedule_time") as string;
    const patient_schedule_date = data.get("schedule_date") as string;

    const patient_checkboxes = document.querySelectorAll('input[name="opc_checkbox"]:checked');
    const patient_selectedValue = Array.from(patient_checkboxes).map((checkbox) => (checkbox as HTMLInputElement).value);

    const patient_newSelectedValue = patient_selectedValue.map((value) => {
      const id = value.split("_")[0];
      const exame = value.split("_")[1];
      return {
        id: Number(id),
        // exame,
      };
    }
    );

    const isToCreateSchedule = patient_schedule_date && patient_schedule_time;

    if (isToCreateSchedule) {
      try {
        patient_name = selectedPatient!.nome;
      } catch (error) {
        ___showSuccessToastNotification({ message: `Erro ao tentar acessar o nome do paciente` })
        return;
      }
    }

    if (isToCreateSchedule) {
      const errorsErrors: string[] = [];

      patient_newSelectedValue.length == 0 && errorsErrors.push("Selecione pelo menos um exame");

      const todayDate = new Date().toLocaleDateString();
      const todayTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

      const patient_date_to_local_date = new Date(patient_schedule_date).toLocaleDateString();
      const patient_date_to_local_time = new Date("2000-01-01 " + patient_schedule_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

      const patientScheduleDateIsBellowOfTodayData = patient_date_to_local_date < todayDate;
      const patientScheduleTimeIsBellowOfTodayData = patient_date_to_local_date == todayDate && patient_date_to_local_time < todayTime;

      patientScheduleDateIsBellowOfTodayData && errorsErrors.push("A data de agendamento não pode ser inferior a data de hoje");
      patientScheduleTimeIsBellowOfTodayData && errorsErrors.push("Agendamentos do dia presente não podem ter hora e minuto inferior ao momento presente. No momento são " + todayTime + ", e a data selecionada é " + patient_date_to_local_time);

      if (errorsErrors.length > 0) {
        ___showErrorToastNotification({ messages: errorsErrors });
        return;
      }

      const patient_data = {
        id_paciente: selectedPatient!.id,
        id_unidade_de_saude: loggedUser.id_unidade_de_saude,
        data_agendamento: patient_schedule_date.replace(/\//g, "-"),
        hora_agendamento: patient_schedule_time,
        exames_paciente: patient_newSelectedValue,
      };

      setIsSaving(true);
      ___api
        .post("/schedulings/set-schedule", patient_data)
        .then((res) => {
          if (res.status == 201) {
            ___showSuccessToastNotification({ message: "Agendamento marcado com sucesso" });
            setSelectedPatient(undefined);
            // setWindowDialog(false);
            // setMessageDialog(true);
          } else {
            ___showErrorToastNotification({ message: "Erro ao marcar Agendamento.\nTente novamente, mas se o erro persistir, entre em contato com o suporte." });
          }
        })
        .catch((err) => {
          ___showErrorToastNotification({ message: "Erro ao marcar Agendamento... Tente novamente, mas se o erro persistir, entre em contato com o suporte." });

          console.log("🚀 ~ file: page.tsx:207 ~ .then ~ err:", err);
        })
        .finally(() => setIsSaving(false));
      return;
    }
  }

  return (
    <div className="h-screen px-4">
      <h1 className="font-light text-3xl my-6">Novo Agendamento</h1>
      <div>
        <form action={onSubmitFn} className="flex flex-wrap w-full gap-3">
          <div className="flex flex-col flex-1 gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-y-4">
                {isLoading ? (
                  <p className="flex items-center">
                    <LoaderCircle className="animate-spin mr-2" /> Carregando lista de pacientes...
                  </p>
                ) : (
                  <div className="flex border-2 border-akin-yellow-light rounded-lg bg-akin-yellow-light/20 ring-0 relative">
                    <AutoComplete
                      placeholder={selectedPatient?.nome || "Nome completo do paciente"}
                      name="name"
                      className="border-0 ring-0 flex-1"
                      lookingFor="paciente"
                      dataFromServer={availablePatientsAutoComplete}
                      setSelectedItemId={setSelectedItemId}
                    />
        
                    <ModalNewPatient />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Input.CalenderDate
                    disabled
                    noUseLabel
                    placeholder="Data de Nascimento"
                    maxDate={new Date()}
                    name="birth_day"
                    valueDate={selectedPatient?.data_nascimento ? new Date(selectedPatient.data_nascimento) : null}
                  />
                  <Input.Dropdown
                    disabled
                    data={genders}
                    name="gender"
                    placeholder="Selecione o sexo"
                    valueData={selectedPatient?.sexo.nome}
                  />
                </div>
                <Input.InputText maxLength={0} placeholder="Contacto telefónico" name="phone_number" value={selectedPatient?.contacto_telefonico} disabled />
                <Input.InputText maxLength={0} placeholder="Bilhete de Identidade" name="identity" value={selectedPatient?.numero_identificacao} disabled />
              </div>
            </div>
            <div>
              <h2 className="font-bold">Data do Agendamento</h2>
              <hr />
              <div className="flex gap-2 mt-4">
                <Input.CalenderDate valueDate={new Date()} minDate={new Date()} name="schedule_date" />
                <Input.CalenderTime name="schedule_time" />
              </div>
            </div>
          </div>
          <div className="h-[29rem] w-[15rem] flex flex-col border-2 border-akin-yellow-light rounded-lg bg-akin-yellow-light/20">
            <div className="space-y-4 flex-1 p-2">
              <div className="space-y-2 model p-4 h-[24rem]">
                <h1 className="font-bold text-xl -mx-4">Exames Disponíveis</h1>
                <View.Scroll className="max-h-full overflow-y-auto space-y-2 h-full">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <ProgressSpinner style={{ width: "25px", height: "25px" }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>
                  ) : avaliableExams.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400">Não há exames disponíveis</p>
                    </div>
                  ) : (
                    avaliableExams.map((exame, index) => (
                      <CheckBoxExam key={index} description={exame.nome} value={String(exame.id)} />
                    ))
                  )}
                </View.Scroll>
              </div>
            </div>
            <Button.Primary className="m-2" type="submit" label={isSaving ? "Marcando..." : "Agendar"} disabled={isSaving} />
          </div>
        </form>
      </div>
    </div>
  );
}  

