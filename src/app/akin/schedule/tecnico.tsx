"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { Exam } from "../patient/[id]/exam-history/useExamHookData";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { LabChief, labChiefRoutes } from "@/module/services/api/routes/lab-chief";

export interface LabTechnician {
  id: string;
  nome_completo?: string;
  nome:string;
  numero_identificacao: string;
  data_nascimento: string;
  tipo: string;
  contacto_telefonico: string;
  criado_aos: string;
  atualizado_aos: string;
  id_sexo: number;
  id_usuario: string;
}

interface AllocateTechniciansModalProps {
  children?: React.ReactNode;
  technicians: LabTechnician[];
  exams: Exam[];
  onAllocate?: (allocations: { examId: number; id_tecnico_alocado: string[] }[]) => void;
  isLabChief?: boolean;
  labChiefs?: LabChief;
}

export const AllocateTechniciansModal: React.FC<AllocateTechniciansModalProps> = ({
  technicians,
  exams,
  onAllocate,
  children,
  isLabChief = false,
  labChiefs,
}) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<{ [key: number]: LabTechnician[] }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  console.log("Exames:", exams);
  console.log(" Technicians:", technicians);  

  const handleTechnicianSelection = (examId: number, technician: LabTechnician) => {
    setSelectedTechnicians((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((tech) => tech.id === technician.id);

      // Atualização da seleção
      const newSelection = isAlreadySelected
        ? currentSelection.filter((tech) => tech.id !== technician.id)
        : [technician]; // Permita apenas um técnico por exame

      console.log("Novo estado selecionado:", newSelection);

      return { ...prev, [examId]: newSelection };
    });
  };

  const handleLabChiefSelection = (examId: number, labChief: LabChief) => {
    setSelectedTechnicians((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((chief) => chief.id === labChief.id);

      const newSelection = isAlreadySelected
        ? currentSelection.filter((chief) => chief.id !== labChief.id)
        : [labChief];

      return { ...prev, [examId]: newSelection };
    });
  };

  const allExamsAllocated = exams.every(
    //@ts-ignore 
    (exam) => exam.id_tecnico_alocado != null
  );

  const handleConfirm = async () => {
    const allocations = Object.entries(selectedTechnicians).map(([examId, technicians]) => ({
      examId: Number(examId),
      id_tecnico_alocado: technicians.map((tech) => tech.id),
    }));
    console.log("Alocações:", allocations);

    if (allocations.length === 0) {
      ___showErrorToastNotification({
        message: "Nenhuma alocação foi realizada. Selecione técnicos para pelo menos um exame.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isLabChief) {
        await Promise.all(
          allocations.map((e) =>
            labChiefRoutes.allocateLabChief(e.examId, e.id_tecnico_alocado[0])
          )
        );
      } else {
        await Promise.all(
          allocations.map((e) =>
            _axios.post(`/exams/technician/set/${e.examId}`, {
              id_tecnico_alocado: e.id_tecnico_alocado.toString(),
            })
          )
        );
      }
      ___showSuccessToastNotification({ message: "Alocação confirmada!" });
      setIsLoading(false);
      setIsSucess(false);
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao confirmar Alocação!" });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLabChiefs = Array.isArray(labChiefs) ? labChiefs.filter(
    (chief) =>
      chief.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chief.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <Dialog open={isSucess}>
      <DialogTrigger asChild onClick={() => setIsSucess(true)}>{children}</DialogTrigger>
      <DialogContent className="w-full h-full sm:h-[95%] lg:min-w-[700px] lg:h-[600px] overflow-auto [&::-webkit-scrollbar]:hidden">
        <DialogDescription></DialogDescription>
        <DialogHeader>
          <DialogTitle>{isLabChief ? "Alocar Chefes de Laboratório" : "Alocar Técnicos"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {
            allExamsAllocated ? (
              <div className="text-center text-lg font-medium text-gray-700">
                Todos os exames já foram alocados com técnicos.
              </div>
            ) : (
              exams.map((exam) => (
                // @ts-ignore
                <div key={exam.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      {/* @ts-ignore */}
                      <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                      {/* @ts-ignore */}
                      <p className="text-sm text-gray-600">Data: {exam.scheduledAt}</p>
                      {/* @ts-ignore */}
                      <p className="text-sm text-gray-600">Hora: {exam.hourSchedule}</p>
                      {/* @ts-ignore */}
                      <p className="text-sm text-gray-600">Técnico Alocado: {exam.id_tecnico_alocado != null ? "1 alocado" : "0 alocado"}</p>

                      {/* @ts-ignore */}
                      {errors[exam.id] && (
                        // @ts-ignore
                        <p className="text-sm text-red-500 mt-2">{errors[exam.id]}</p>
                      )}
                      {isExpanded && (
                        <div className="mt-4 space-y-2">
                          {/* @ts-ignore */}
                          {selectedTechnicians[exam.id]?.map((tech) => (
                            <Badge
                              key={tech.id}
                              variant="outline"
                              className="text-xs flex justify-between items-center"
                            >
                              {tech.nome_completo}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {isLabChief ? "Selecionar Chefes de Laboratório" : "Selecionar Técnicos"}
                        </label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Pesquise por nome ou cargo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                          />
                          <ScrollArea className="max-h-40 border rounded-md p-2 overflow-auto">
                            {(isLabChief ? filteredLabChiefs : filteredTechnicians).map((person) => (
                              // @ts-ignore
                              <div
                                key={person.id}
                                className={`flex flex-col items-start md:flex-row justify-between p-2  rounded-md my-1 cursor-pointer 
                                  ${
                                  // @ts-ignore
                                  selectedTechnicians[exam.id]?.some((p) => p.id === person.id)
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-100"
                                  }`}
                                // @ts-ignore
                                onClick={() => isLabChief ? handleLabChiefSelection(exam.id, person) : handleTechnicianSelection(exam.id, person)}
                              >
                                <div>
                                  <p className="text-sm font-medium">{person.nome}</p>
                                  <p className="text-xs text-gray-600">{person.tipo}</p>
                                </div>
                                {
                                  // @ts-ignore
                                  selectedTechnicians[exam.id]?.some(
                                    (p) => p.id === person.id
                                  ) && (
                                    <Badge variant="secondary" className="text-xs">
                                      Selecionado
                                    </Badge>
                                  )
                                }
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2"
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      {isExpanded ? "Ocultar Seleção" : "Exibir Seleção"}
                    </Button>
                    {!isExpanded && (
                      <Badge variant="secondary" className="text-xs">
                        {/* @ts-ignore */}
                        Total: {selectedTechnicians[exam.id]?.length || 0} {isLabChief ? "chefe(s)" : "técnico(s)"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )
          }
        </div>
        <DialogFooter className="mt-6 flex flex-col-reverse gap-3 lg:flex-row">
          <Button variant="outline"
            onClick={() => {
              setIsSucess(false)
              setSelectedTechnicians({})
            }
            }>
            Cancelar
          </Button>

          <Button variant="secondary" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? <Loader size={24} /> : "Confirmar Alocações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
};
