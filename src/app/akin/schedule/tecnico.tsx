import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Technician {
  id: number;
  name: string;
  role: string; // Cargo do técnico
}

interface Exam {
  id: number;
  name: string;
  scheduledAt: string; // Data e hora do agendamento
}

interface AllocateTechniciansModalProps {
  children?: React.ReactNode;
  technicians: Technician[];
  exams: Exam[];
  onAllocate?: (allocations: { examId: number; technicianIds: number[] }[]) => void;
}

export const AllocateTechniciansModal: React.FC<AllocateTechniciansModalProps> = ({
  technicians,
  exams,
  onAllocate,
  children,
}) => {
  const [selectedTechnicians, setSelectedTechnicians] = useState<{ [key: number]: Technician[] }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleTechnicianSelection = (examId: number, technician: Technician) => {
    setSelectedTechnicians((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((tech) => tech.id === technician.id);

      return {
        ...prev,
        [examId]: isAlreadySelected
          ? currentSelection.filter((tech) => tech.id !== technician.id)
          : [...currentSelection, technician],
      };
    });
  };

  const handleConfirm = () => {
    const allocations = exams.map((exam) => ({
      examId: exam.id,
      technicianIds: selectedTechnicians[exam.id]?.map((tech) => tech.id) || [],
    }));
    if (onAllocate) onAllocate(allocations);
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[700px] h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Alocar Técnicos</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {exams.map((exam) => (
            <div key={exam.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start justify-between">
                {/* Informações do Exame */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-600">Data: {exam.scheduledAt}</p>
                  {
                    isExpanded && (
                      <div className="mt-4 space-y-2">
                        {selectedTechnicians[exam.id]?.map((tech) => (
                          <Badge
                            key={tech.id}
                            variant="outline"
                            className="text-xs flex justify-between items-center"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                      </div>
                    )
                  }

                </div>

                {/* Seleção de Técnicos */}
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
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedTechnicians[exam.id]?.some((tech) => tech.id === technician.id)
                              ? "bg-blue-100"
                              : "hover:bg-gray-100"
                              }`}
                            onClick={() => handleTechnicianSelection(exam.id, technician)}
                          >
                            <div>
                              <p className="text-sm font-medium">{technician.name}</p>
                              <p className="text-xs text-gray-600">{technician.role}</p>
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
              {/* Arrow para expandir/fechar */}
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
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => setSelectedTechnicians({})}>
              Cancelar
            </Button>
          </DialogClose>

          <Button variant="secondary" onClick={handleConfirm}>
            Confirmar Alocações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
