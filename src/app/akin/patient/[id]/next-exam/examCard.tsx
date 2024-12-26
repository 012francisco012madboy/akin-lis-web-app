import { Button } from "@/components/ui/button";
import { ResponseData } from "./types";
import { AlerDialogNextExam } from "./_alertDialog";
import { MedicalMaterialsModal } from "./_materialModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { LabTechnician } from "@/app/akin/schedule/tecnico";

export const ExamCard = ({ data }: ResponseData) => {
  const [isNextExamOpen, setIsNextExamOpen] = useState<boolean>(false);
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState<boolean>(false);

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

  const handleIgnore = () => {
    setIsNextExamOpen(false);
    setIsMaterialsModalOpen(true);
  };

  return (
    data.map((exam) => (
      <div key={exam.id} className="bg-white shadow-lg rounded-xl p-6 mb-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{exam.Tipo_Exame.nome}</h3>
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
              ) :(
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
          <Button
            className="mt-24 text-md font-medium"
            onClick={() => setIsNextExamOpen(true)}
          >
            Começar
          </Button>
        </div>
        <>
          <AlerDialogNextExam
            isOpen={isNextExamOpen}
            onClose={() => setIsNextExamOpen(false)}
            onIgnore={handleIgnore}
          />
          <MedicalMaterialsModal
            isOpen={isMaterialsModalOpen}
            onClose={() => setIsMaterialsModalOpen(false)}
          />
        </>
      </div>
    ))
  );
};