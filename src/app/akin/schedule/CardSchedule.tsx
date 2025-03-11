"use client";

import React, { useState } from "react";
import Image from "next/image";
import Primary from "@/components/button/primary";
import { View } from "@/components/view";
import { Trash, CheckCircle, Pencil } from "lucide-react";
import { AllocateTechniciansModal, LabTechnician } from "./tecnico";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { Exam } from "../patient/[id]/exam-history/useExamHookData";
import { EditScheduleFormModal } from "./editScheduleData";
import { labChiefRoutes } from "@/module/services/routes/lab-chief";
import { getAllDataInCookies } from "@/utils/get-data-in-cookies";

interface ICardSchedule {
  data: ScheduleType;
}

export default function CardSchedule({ data }: ICardSchedule) {
  const [showExams, setShowExams] = useState(false);
  const [groupedExams, setGroupedExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userRole = getAllDataInCookies().userRole;
  const role = "RECEPCIONISTA";


  const handleEditClick = (exam: Exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const tecnico = useQuery({
    queryKey: ["lab-tech"],
    queryFn: async () => {
      return await _axios.get<LabTechnician[]>("lab-technicians");
    },
  });

  const labChiefs = useQuery({
    queryKey: ["lab-chief"],
    queryFn: async () => {
      return await labChiefRoutes.getAllLabChief();
    },
  });

  if (labChiefs.isLoading) {
    return <div>Loading...</div>;
  }

  console.log("lab", labChiefs.data);

  const handleGroupExams = () => {
    if (data?.Exame?.length > 0) {
      const exams = data.Exame
        .filter((exame) => !exame.id_tecnico_alocado) // Excluir exames com técnicos alocados
        .map((exame) => ({
          id: exame.id,
          name: exame.Tipo_Exame?.nome || "Nome não disponível",
          scheduledAt: exame.data_agendamento,
          hourSchedule: exame.hora_agendamento,
          id_tecnico_alocado: exame.id_tecnico_alocado,
        }));
      // @ts-ignore
      setGroupedExams(exams);
    }
  };

  const getTecnicoNome = (id: string | null) => {
    if (!id || id === "null") return "Sem técnico alocado";

    // Verifica se os dados estão sendo carregados ou se houve um erro
    if (tecnico.isLoading) return "Carregando técnicos...";
    if (tecnico.isError) return "Erro ao carregar técnicos";

    // Verifica se os dados existem e têm o formato esperado
    const tecnicosData = tecnico.data?.data || [];
    if (tecnicosData.length === 0) return "Sem técnico alocado";

    // Busca o técnico pelo ID
    const tecnicoEncontrado = tecnicosData.find((t) => t.id === id);
    return tecnicoEncontrado?.nome_completo || "Técnico não encontrado";
  };

  const age =
    data?.Paciente?.data_nascimento &&
    new Date().getFullYear() - new Date(data.Paciente.data_nascimento).getFullYear();

  //[&::-webkit-scrollbar]:hidden 
  return (
    <div className="card min-w-max  shadow-xl border border-gray-300 rounded-lg flex flex-col items-center bg-white min-h-[400px] max-h-[250px]  transition-all duration-300 hover:scale-105">
      {/* Exame Information */}
      {showExams ? (
        <div className="flex-1 rounded-t-lg w-full overflow-y-scroll [&::-webkit-scrollbar]:hidden space-y-4 p-4 h-[19.2rem]">
          <View.Scroll className="min-w-max max-h-full pl-4 overflow-y-auto space-y-2 ">
            {data.Exame.map((exame) => (
              <div key={exame.id} className="min-w-max w-full pb-4 border-b border-gray-200 ">

                <p className="font-semibold text-xl flex justify-between items-center mr-3">
                  {exame.Tipo_Exame.nome || "Nome não disponível"}
                  {/* <EditScheduleFormModal> */}
                  <div className="relative group">

                    {/* {
                      userRole.data?.data.tipo !== "RECEPCIONISTA" ? (
                        <></>
                      ) : ( */}
                    <>
                      <Pencil size={18}
                        className="cursor-pointer text-gray-500"
                        onClick={() => handleEditClick({
                          // @ts-ignore
                          id: exame.id,
                          name: exame.Tipo_Exame?.nome,
                          date: exame.data_agendamento,
                          time: exame.hora_agendamento,
                          technicianId: exame.id_tecnico_alocado,
                        })}
                      />
                      <span className="absolute cursor-pointer -left-8 top-5 mt-0 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditClick({
                          // @ts-ignore
                          id: exame.id,
                          name: exame.Tipo_Exame?.nome,
                          date: exame.data_agendamento,
                          time: exame.hora_agendamento,
                          technicianId: exame.id_tecnico_alocado,
                        })}
                      >
                        Editar
                      </span>
                    </>
                    {/* )
                    } */}
                    <EditScheduleFormModal
                      active
                      open={isModalOpen}
                      exam={selectedExam}
                      // @ts-ignore
                      examId={selectedExam?.id}
                      //@ts-ignore
                      techName={getTecnicoNome(selectedExam?.technicianId)}
                      onClose={() => setIsModalOpen(false)}
                      onSave={() => {
                        setIsModalOpen(false);
                      }}
                    />
                  </div>
                  {/* </EditScheduleFormModal> */}
                </p>

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
                    {
                      getTecnicoNome(exame.id_tecnico_alocado)
                    }
                  </span>
                </p>
              </div>
            ))}
          </View.Scroll>
        </div>
      ) : (
        <>
          {/* Image and Actions */}
          <div className="min-w-[280px] w-full relative h-48">
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
            <h1 className="text-xl font-semibold">{data.Paciente?.nome_completo} </h1>
            <span className="text-sm text-gray-500">BI: {data.Paciente?.numero_identificacao}</span>
            <span className="text-sm text-gray-500">Sexo: {data.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}</span>
            <span className="text-sm text-gray-500">Idade: {age}</span>
          </div>
        </>
      )}

      {/* Toggle Button */}
      <div className="w-full flex flex-col lg:flex-row  gap-3 px-4  pb-2 text-sm">
        <Primary
          className=" min-w-max w-full h-full flex justify-center bg-cyan-600 text-white font-semibold py-2 rounded-b-lg  transition-all duration-300 hover:bg-cyan-500 outline-none"
          onClick={() => setShowExams((prev) => !prev)}
          label={showExams ? "Agendamento" : "Ver Exame"}
        />
        <AllocateTechniciansModal
          exams={groupedExams}
          technicians={tecnico.data ? tecnico.data.data : []}
          isLabChief={userRole === role}
          //@ts-ignore
          labChiefs={labChiefs.data}
        >
          <Button
            className="w-full h-full"
            onClick={handleGroupExams}
          >
            {
              userRole === role ? "Alocar Chefe" : "Alocar Técnicos"
            }
          </Button>
        </AllocateTechniciansModal>
      </div>
    </div>
  );
}