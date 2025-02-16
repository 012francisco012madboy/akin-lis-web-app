import { Button } from "@/components/ui/button";
import { ResponseData } from "./types";
import { AlerDialogNextExam } from "./_alertDialog";
import { MedicalMaterialsModal } from "./_materialModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { LabTechnician } from "@/app/akin/schedule/tecnico";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { UserData } from "@/app/akin/profile/page";
import { Pencil } from "lucide-react";
import { EditScheduleFormModal } from "@/app/akin/schedule/editScheduleData";

export const ExamCard = ({ data }: ResponseData) => {
  const { user } = useAuthStore();
  const [isNextExamOpen, setIsNextExamOpen] = useState<{ [key: string]: boolean }>({});
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedExam, setSelectedExam] = useState<{ [key: string]: any }>({});
  const [isModalOpen, setIsModalOpen] = useState<{ [key: string]: boolean }>({});

  const handleEditClick = (exam: any) => {
    setSelectedExam((prev) => ({ ...prev, [exam.id]: exam }));
    setIsModalOpen((prev) => ({ ...prev, [exam.id]: true }));
  };

  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      return await _axios.get<UserData>(`/users/${user?.id}`);
    },
  });

  const techLab = useQuery({
    queryKey: ["tech-lab"],
    queryFn: async () => {
      return await _axios.get<LabTechnician[]>("/lab-technicians");
    }
  });

  const getNameTech = (id: string | null) => {
    if (id === null) return 'Não atribuído';
    const tech = techLab.data?.data.find((tech) => tech.id === id);
    return tech?.nome_completo;
  }

  const handleIgnore = (examId: string) => {
    setIsNextExamOpen((prev) => ({ ...prev, [examId]: false }));
    setIsMaterialsModalOpen((prev) => ({ ...prev, [examId]: true }));
  };

  return (
    data.map((exam) => (
      <div key={exam.id} className="bg-white shadow-lg rounded-xl p-6 mb-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 flex items-bottom gap-5 ">
            <span>
              {exam.Tipo_Exame.nome}
            </span>

            <div className="relative group">
              <Pencil size={18}
                className="cursor-pointer text-gray-500"
                onClick={() => handleEditClick({
                  id: exam.id,
                  name: exam.Tipo_Exame?.nome,
                  date: exam.data_agendamento,
                  time: exam.hora_agendamento,
                  technicianId: exam.id_tecnico_alocado,
                  status: exam.status,
                })}
              />
              <span className="absolute cursor-pointer -left-8 top-5 mt-0 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick({
                  id: exam.id,
                  name: exam.Tipo_Exame?.nome,
                  date: exam.data_agendamento,
                  time: exam.hora_agendamento,
                  technicianId: exam.id_tecnico_alocado,
                  status: exam.status,
                })}
              >
                Editar
              </span>

              <EditScheduleFormModal
                open={isModalOpen[exam.id] || false}
                exam={selectedExam[exam.id]}
                examId={exam.id}
                techName={getNameTech(exam.id_tecnico_alocado)}
                onClose={() => setIsModalOpen((prev) => ({ ...prev, [exam.id]: false }))}
                onSave={() => {
                  setIsModalOpen((prev) => ({ ...prev, [exam.id]: false }));
                }}
                active
              />
            </div>
          </h3>
          <p className="text-gray-700"><span className="font-medium">Data:</span> {exam.data_agendamento} às {exam.hora_agendamento}</p>
          <p className="text-gray-700"><span className="font-medium">Status:</span> {exam.status}</p>
          <p className="text-gray-700"><span className="font-medium">Status do Pagamento:</span> {exam.status_pagamento}</p>
          <p className="text-gray-700"><span className="font-medium">Preço:</span> {exam.Tipo_Exame.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p className="text-gray-700 flex items-center gap-1">
            <span className="font-medium">
              Técnico Alocado: {" "}
            </span>
            {
              techLab.isLoading ? (
                <span className="animate-pulse bg-gray-200 h-5 w-20 inline-block"></span>
              ) : (
                getNameTech(exam.id_tecnico_alocado)
              )
            }
          </p>
        </div>
        <div className="flex flex-col min-h-full">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${exam.status === 'PENDENTE'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
              }`}
          >
            {exam.status}
          </span>
          {
            userData?.data?.tipo === 'TECNICO' || userData?.data?.tipo === 'RECEPCIONISTA' ? (
              <p></p>
            ) : (
              <Button
                className="mt-24 text-md font-medium"
                onClick={() => setIsNextExamOpen((prev) => ({ ...prev, [exam.id]: true }))}
              >
                Começar
              </Button>
            )
          }
        </div>
        <>
          <AlerDialogNextExam
            isOpen={isNextExamOpen[exam.id] || false}
            onClose={() => setIsNextExamOpen((prev) => ({ ...prev, [exam.id]: false }))}
            onIgnore={() => handleIgnore(String(exam.id))}
          />
          <MedicalMaterialsModal
            // //@ts-ignore
            // isOpen={isMaterialsModalOpen}
            // //@ts-ignore
            // onClose={() => setIsMaterialsModalOpen(false)}

            isOpen={isMaterialsModalOpen[exam.id] || false}
            onClose={() => setIsMaterialsModalOpen((prev) => ({ ...prev, [exam.id]: false }))}
            exam_id={String(exam.id_tipo_exame)}
            patient_name={"Paulo"}
            exam_name={exam.Tipo_Exame.nome}
          />
        </>
      </div>
    ))
  );
};