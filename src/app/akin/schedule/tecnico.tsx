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

export interface LabTechnician {
  id: string;
  nome_completo: string;
  numero_identificacao: string;
  data_nascimento: string;
  cargo: string;
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
}

export const AllocateTechniciansModal: React.FC<AllocateTechniciansModalProps> = ({
  technicians,
  exams,
  onAllocate,
  children,
}) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<{ [key: number]: LabTechnician[] }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSucess, setIsSucess] = useState<boolean>(false);

  const handleTechnicianSelection = (examId: number, technician: LabTechnician) => {
    setSelectedTechnicians((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((tech) => tech.id === technician.id);

      const newSelection = isAlreadySelected
        ? currentSelection.filter((tech) => tech.id !== technician.id)
        : [...currentSelection, technician];

      if (newSelection.length > 1) {
        setErrors((prevErrors) => ({ ...prevErrors, [examId]: "Selecione apenas um técnico." }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [examId]: "" }));
      }

      return { ...prev, [examId]: newSelection };
    });
  };

  const handleConfirm = async () => {
    const newErrors: { [key: number]: string } = {};
    let hasError = false;

    exams.forEach((exam) => {
      const technicians = selectedTechnicians[exam.id] || [];

      if (technicians.length === 0) {
        newErrors[exam.id] = "É necessário selecionar um técnico.";
        hasError = true;
      } else if (technicians.length > 1) {
        newErrors[exam.id] = "Selecione apenas um técnico.";
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const allocations = exams.map((exam) => ({
      examId: exam.id,
      id_tecnico_alocado: selectedTechnicians[exam.id]?.map((tech) => tech.id) || [],
    }));

    if (onAllocate) onAllocate(allocations);
    setIsLoading(true);
    try {
      const res = await Promise.all(
        allocations.map((e) =>
          _axios.post(`/exams/technician/set/${e.examId}`, {
            id_tecnico_alocado: e.id_tecnico_alocado.toString(),
          })
        )
      );
      ___showSuccessToastNotification({ message: "Alocação confirmada!" })
      setIsLoading(false);
      setIsSucess(false);
      console.log(res)
    } catch (error) {
      ___showErrorToastNotification({ message: "Erro ao confirmar Alocação!" })
      console.error("Erro ao alocar técnicos:", error);
    }
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isSucess}>
      <DialogTrigger asChild onClick={() => setIsSucess(true)}>{children}</DialogTrigger>
      <DialogContent className="w-full h-full sm:h-[95%] lg:min-w-[700px] lg:h-[600px] overflow-auto [&::-webkit-scrollbar]:hidden">
        <DialogDescription></DialogDescription>
        <DialogHeader>
          <DialogTitle>Alocar Técnicos</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {exams.map((exam) => (
            <div key={exam.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600">Data: {exam.scheduledAt}</p>
                  {errors[exam.id] && (
                    <p className="text-sm text-red-500 mt-2">{errors[exam.id]}</p>
                  )}
                  {isExpanded && (
                    <div className="mt-4 space-y-2">
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
                      Selecionar Técnicos
                    </label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Pesquise por nome ou cargo"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      <ScrollArea className="max-h-40 border rounded-md p-2 overflow-auto">
                        {filteredTechnicians.map((technician) => (
                          <div
                            key={technician.id}
                            className={`flex flex-col items-start md:flex-row justify-between p-2  rounded-md my-1 cursor-pointer ${selectedTechnicians[exam.id]?.some((tech) => tech.id === technician.id)
                              ? "bg-blue-100"
                              : "hover:bg-gray-100"
                              }`}
                            onClick={() => handleTechnicianSelection(exam.id, technician)}
                          >
                            <div>
                              <p className="text-sm font-medium">{technician.nome_completo}</p>
                              <p className="text-xs text-gray-600">{technician.cargo}</p>
                            </div>
                            {selectedTechnicians[exam.id]?.some(
                              (tech) => tech.id === technician.id
                            ) && (
                                <Badge variant="secondary" className="text-xs">
                                  Selecionado
                                </Badge>
                              )}
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
                    Total: {selectedTechnicians[exam.id]?.length || 0} técnico(s)
                  </Badge>
                )}
              </div>
            </div>
          ))}
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
