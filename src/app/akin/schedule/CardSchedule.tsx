"use client";

import React, { useState } from "react";
import Image from "next/image";
import Primary from "@/components/button/primary";
import { View } from "@/components/view";
import { Trash, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button"
import { AllocateTechniciansModal } from "./tecnico";

interface ICardSchedule {
  data: ScheduleType;
}

export default function CardSchedule({ data }: ICardSchedule) {
  const [showExams, setShowExams] = useState(false);

  const age = new Date().getFullYear() - new Date(data.Paciente.data_nascimento).getFullYear();
  const formattedDate = new Date(data.data_agendamento).toLocaleString();

  const exame = [
    { id: 1, name: "Exame A", scheduledAt: "2024-11-29 - 10:00" },
    { id: 2, name: "Exame B", scheduledAt: "2024-11-30 - 14:00" },
    { id: 3, name: "Exame C", scheduledAt: "2024-12-01 -  08:30" },
    { id: 4, name: "Exame D", scheduledAt: "2024-12-02 - 11:15" },
    { id: 5, name: "Exame E", scheduledAt: "2024-12-03 -  16:00" },
    { id: 6, name: "Exame F", scheduledAt: "2024-12-04 - 09:45" },
    { id: 7, name: "Exame G", scheduledAt: "2024-12-05 -  13:30" },
    { id: 8, name: "Exame H", scheduledAt: "2024-12-06 - 15:00" },
    { id: 9, name: "Exame I", scheduledAt: "2024-12-07 - 10:30" },
    { id: 10, name: "Exame J", scheduledAt: "2024-12-08 - 12:00" },

  ];

  const tecnico = [
    { id: 1, name: "João Silva", role: "Enfermeiro" },
    { id: 2, name: "Maria Souza", role: "Técnico de Radiologia" },
    { id: 3, name: "Carlos Lima", role: "Fisioterapeuta" },
    { id: 4, name: "Ana Costa", role: "Médica" },
    { id: 5, name: "Paulo Oliveira", role: "Técnico de Enfermagem" },
    { id: 6, name: "Fernanda Almeida", role: "Nutricionista" },
    { id: 7, name: "Roberta Silva", role: "Psicóloga" },
    { id: 8, name: "Ricardo Ferreira", role: "Técnico de Laboratório" },
    { id: 9, name: "Luana Pereira", role: "Terapeuta Ocupacional" },
    { id: 10, name: "Eduardo Martins", role: "Médico Cirurgião" },
    { id: 11, name: "Bruna Rocha", role: "Farmacêutica" },
    { id: 12, name: "Sérgio Santos", role: "Radioterapeuta" },
    { id: 13, name: "Isabela Macedo", role: "Técnico de Análises Clínicas" },
    { id: 14, name: "Lucas Gomes", role: "Fonoaudiólogo" },
    { id: 15, name: "Vânia Souza", role: "Técnico de Enfermagem" }
  ];

  return (
    <div className="card shadow-xl border border-gray-300 rounded-lg flex flex-col items-center bg-white min-h-[23rem] max-h-[23rem] overflow-hidden transition-all duration-300 hover:scale-105">
      {/* Exame Information */}
      {showExams ? (
        <div className="flex-1 rounded-t-lg w-full space-y-4 p-4 h-[19.2rem]">
          <View.Scroll className="max-h-full pl-4 overflow-y-auto space-y-2">
            {data.Exame.map((exame) => (
              <div key={exame.id} className="w-full pb-4 border-b border-gray-200 ">
                <p className="font-semibold text-xl"> {exame.Tipo_Exame.nome || "Nome não disponível"}</p>
                <p className="pl-6  text-gray-500 text-sm font-semibold">
                  Estado:{" "}
                  <span

                    className={` text-xs font-medium  ${exame.status === "ATIVO" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {exame.status}
                  </span>
                </p>
                <p className="pl-6  text-gray-500 text-sm font-semibold">
                  Data de Agendamento:{" "}
                  <span

                    className={` text-xs font-medium  ${exame.status === "ATIVO" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {exame.data_agendamento}
                  </span>
                </p>
                <p className="pl-6  text-gray-500 text-sm font-semibold">
                  Hora de Agendamento:{" "}
                  <span

                    className={` text-xs font-medium  ${exame.status === "ATIVO" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {exame.hora_agendamento}
                  </span>
                </p>
              </div>
            ))}
          </View.Scroll>
        </div>
      ) : (
        <>
          {/* Image and Actions */}
          <div className="w-full relative h-48">
            <Image
              className="bg-center object-cover rounded-t-lg"
              src="/images/exam/Plasmodium.png"
              alt="Imagem do exame"
              fill
            />
            {data.status === "PENDENTE" && (
              <div className="absolute top-2 right-2 bg-black/60 p-2 rounded-lg flex space-x-2">
                <button className="text-red-300 hover:text-red-100 flex items-center space-x-1">
                  <Trash size={15} /> <span>Rejeitar</span>
                </button>
                <button className="text-green-300 hover:text-green-100 flex items-center space-x-1">
                  <CheckCircle size={15} /> <span>Aceitar</span>
                </button>
              </div>
            )}
          </div>

          {/* Patient Information */}
          <div className="w-full px-4 py-2 space-y-1.5 flex flex-col mt-2 text-gray-800">
            <h1 className="text-xl font-semibold">{data.Paciente?.nome}</h1>
            <span className="text-sm text-gray-500">BI: {data.Paciente?.numero_identificacao}</span>
            <span className="text-sm text-gray-500">Sexo: {data.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}</span>
            <span className="text-sm text-gray-500">Idade: {age}</span>
          </div>
        </>
      )}

      {/* Toggle Button */}
      <div className="w-full flex flex-col lg:flex-row mt-4 gap-3 px-4 pb-2 text-sm">
        <Primary
          className="w-full h-full flex justify-center bg-cyan-600 text-white font-semibold py-2 rounded-b-lg  transition-all duration-300 hover:bg-cyan-500 outline-none"
          onClick={() => setShowExams((prev) => !prev)}
          label={showExams ? "Ver Agendamento" : "Ver Exame"}
        />
        <AllocateTechniciansModal exams={exame} technicians={tecnico} >
          <Button className="w-full h-full">Alocar Técnicos</Button>
        </AllocateTechniciansModal>
      </div>
    </div>
  );
}
