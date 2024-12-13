"use client";

import React, { useState } from "react";
import Image from "next/image";
import Primary from "@/components/button/primary";
import { View } from "@/components/view";
import { Trash, CheckCircle } from "lucide-react";
import { AllocateTechniciansModal, LabTechnician } from "./tecnico";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { Exam } from "../patient/[id]/exam-history/useExamHookData";

interface ICardSchedule {
  data: ScheduleType;
}

export default function CardSchedule({ data }: ICardSchedule) {
  const [showExams, setShowExams] = useState(false);
  const [groupedExams, setGroupedExams] = useState<Exam[]>([]);


  const tecnico = useQuery({
    queryKey: ["lab-tech"],
    queryFn: async () => {
      return await _axios.get<LabTechnician[]>("lab-technicians");
    },
  });

  const handleGroupExams = () => {
    if (data?.Exame?.length > 0) {
      const exams = data.Exame.map((exame) => ({
        id: exame.id,
        name: exame.Tipo_Exame?.nome || "Nome não disponível",
        scheduledAt: exame.data_agendamento,

      }));
      // @ts-ignore
      setGroupedExams(exams);
    }
  };

  const age =
    data?.Paciente?.data_nascimento &&
    new Date().getFullYear() - new Date(data.Paciente.data_nascimento).getFullYear();

  //[&::-webkit-scrollbar]:hidden 
  return (
    <div className="card shadow-xl border border-gray-300 rounded-lg flex flex-col items-center bg-white min-h-[400px] max-h-[250px] overflow-hidden transition-all duration-300 hover:scale-105">
      {/* Exame Information */}
      {showExams ? (
        <div className="flex-1 rounded-t-lg w-full [&::-webkit-scrollbar]:hidden space-y-4 p-4 h-[19.2rem]">
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
                <p className="pl-6  text-gray-500 text-sm font-semibold">
                  Técnicos Alocados:{" "}
                  <span

                    className={` text-xs font-medium  ${exame.status === "ATIVO" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {(exame.id_tecnico_alocado && exame.id_tecnico_alocado!.length > 0) ? `${"1"} alocado(s)` : "Sem técnico alocado"}
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
            <h1 className="text-xl font-semibold">{data.Paciente?.nome_completo}</h1>
            <span className="text-sm text-gray-500">BI: {data.Paciente?.numero_identificacao}</span>
            <span className="text-sm text-gray-500">Sexo: {data.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}</span>
            <span className="text-sm text-gray-500">Idade: {age}</span>
          </div>
        </>
      )}

      {/* Toggle Button */}
      <div className="w-full flex flex-col lg:flex-row  gap-3 px-4  pb-2 text-sm">
        <Primary
          className="w-full h-full flex justify-center bg-cyan-600 text-white font-semibold py-2 rounded-b-lg  transition-all duration-300 hover:bg-cyan-500 outline-none"
          onClick={() => setShowExams((prev) => !prev)}
          label={showExams ? "Ver Agendamento" : "Ver Exame"}
        />
        <AllocateTechniciansModal
          exams={groupedExams}
          technicians={tecnico.data ? tecnico.data.data : []}
        >
          <Button
            className="w-full h-full"
            onClick={handleGroupExams}
          >
            Alocar Técnicos
          </Button>
        </AllocateTechniciansModal>

      </div>
    </div>
  );
}
