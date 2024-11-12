"use client";

import React, { useState } from "react";
import Image from "next/image";
import Primary from "@/components/button/primary";
import { View } from "@/components/view";
import { Trash, CheckCircle } from "lucide-react";

interface ICardSchedule {
  data: ScheduleType;
}

export default function CardSchedule({ data }: ICardSchedule) {
  const [showExams, setShowExams] = useState(false);

  const age = new Date().getFullYear() - new Date(data.Paciente.data_nascimento).getFullYear();
  const formattedDate = new Date(data.data_agendamento).toLocaleString();

  return (
    <div className="card shadow-lg border rounded-lg flex flex-col items-center bg-[#fcfcfc] min-h-[23rem] max-h-[23rem]">
      {showExams ? (
        <div className="flex-1 rounded-t-lg w-full space-y-2 p-4 h-[19.2rem]">
          <View.Scroll className="max-h-full pl-4 overflow-y-auto space-y-2">
            {data.Exame.map((exame) => (
              <div key={exame.id} className="w-full pb-4">
                <p className="font-bold text-2xl">- {exame.exame.nome}</p>
                <p className="lowercase pl-6 italic">
                  Estado:{" "}
                  <span
                    data-isActive={exame.status}
                    className="text-red-500 data-[isActive='ATIVO']:text-green-500"
                  >
                    {exame.status}
                  </span>
                </p>
              </div>
            ))}
          </View.Scroll>
        </div>
      ) : (
        <>
          <div className="w-full relative h-44">
            <Image
              className="bg-center overflow-hidden rounded-t-lg"
              src="/images/exam/Plasmodium.png"
              fill
              alt="Imagem do exame"
            />
            {data.status === "PENDENTE" && (
              <div className="absolute top-1 right-1 bg-black/50 space-x-2 rounded-lg px-2 flex">
                <p className="text-red-300 cursor-pointer hover:text-red-100">
                  <Trash size={15} /> Rejeitar
                </p>
                <p className="text-green-300 cursor-pointer hover:text-green-100">
                  <CheckCircle size={15} /> Aceitar
                </p>
              </div>
            )}
          </div>
          <div className="w-full px-4 py-1 space-y-1.5 flex flex-col mt-1 text-cyan-800">
            <h1 className="text-xl font-bold">{data.Paciente?.nome}</h1>
            <span>BI: {data.Paciente?.numero_identificacao}</span>
            <span>Sexo: {data.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}</span>
            <span>Idade: {age}</span>
            <p>Marcado em: {formattedDate}</p>
          </div>
        </>
      )}

      <div className="w-full mt-1">
        <Primary
          className="w-full flex justify-center bg-akin-turquoise text-white font-semibold rounded-t-none"
          onClick={() => setShowExams((prev) => !prev)}
          label={showExams ? "Ver Agendamento" : "Ver Exame"}
        />
      </div>
    </div>
  );
}
