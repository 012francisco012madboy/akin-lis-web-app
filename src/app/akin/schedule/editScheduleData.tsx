"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { LabTechnician } from "./tecnico";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";

//Precisa de ser atualizado o Typescript desse componente e aplicar refatoração
export function EditScheduleFormModal({
  open,
  exam,
  onClose,
  onSave,
  children,
  techName,
  examId,
}: any): JSX.Element {
  const [formData, setFormData] = useState(
    exam || {
      id: "",
      date: "",
      time: "",
      technicianId: "",
      status: "",
      techName: "",
      examId: "",
    }
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    Record<string, any[]>
  >({});

  const queryClient = useQueryClient();

  // Fetch dos técnicos
  const technicians = useQuery({
    queryKey: ["lab-techs"],
    queryFn: async () => {
      const response = await _axios.get<LabTechnician[]>("lab-technicians");
      return response.data;
    },
  });

  // Mutação para salvar os dados
  const saveScheduleMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsProcessing(true);
      const response = await _axios.patch(`/exams/${examId}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      ___showSuccessToastNotification({ message: "Dados atualizados com sucesso!" });
      queryClient.invalidateQueries();
      queryClient.invalidateQueries({ queryKey: ["schedules", "lab-techs"] }); // Atualizar lista de exames
      if (onSave) onSave(data); // Callback de sucesso
    },
    onError: () => {
      ___showErrorToastNotification({ message: "Erro ao atualizar dados" });
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (exam) {
      setFormData(exam);
    }
  }, [exam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTechnicianSelection = (examId: number, technician: LabTechnician) => {
    setSelectedTechnicians((prev) => ({
      ...prev,
      [examId]: [technician], // Permita apenas um técnico por exame
    }));
  };

  if (technicians.isLoading) return <></>;
  if (technicians.isError) {
    ___showErrorToastNotification({
      message: "Erro ao carregar técnicos"
    });
    return <></>;
  }

  const filteredTechnicians = Array.isArray(technicians.data)
    ? technicians.data.filter(
      (tech) =>
        tech.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleSave = () => {
    const formattedValue = {
      data_agendamento: formData.date,
      hora_agendamento: formData.time,
      id_tecnico_alocado: selectedTechnicians[exam?.id]?.[0]?.id === undefined ? formData.technicianId : String(selectedTechnicians[examId]?.map((tech) => tech.id)),
    };
    console.log(formattedValue);
    saveScheduleMutation.mutate(formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2>
            Editar Exame - <span className="text-zinc-600 font-semibold">{formData.name || "Exame"}</span>
          </h2>
        </DialogHeader>
        {/* Formulário */}
        <div className="card gap-3 w-full">
          <label htmlFor="date" className="font-bold block mb-2">
            Data
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full h-10 px-4 bg-gray-50 text-black rounded-md shadow-sm border-gray-300"
          />
        </div>
        <div className="card gap-3 w-full">
          <label htmlFor="time" className="font-bold block mb-2">
            Hora
          </label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full h-10 px-4 bg-gray-50 text-black rounded-md shadow-sm border-gray-300"
          />
        </div>
        <div className="card gap-3 w-full">
          <label htmlFor="technicianId" className="font-bold block mb-2">
            Técnico Alocado
          </label>
          <Input
            id="technicianId"
            name="technicianId"
            value={techName}
            placeholder="Nome do técnico"
            className="w-full h-12 px-4 bg-gray-50 text-black placeholder:text-black disabled:text-black  focus-visible:ring-0 ring-0 font-semibold text-xl "
            disabled
          />
        </div>
        {/* Alocação de Técnico */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Alocar novo técnico</label>
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
                className={`flex flex-col items-start md:flex-row justify-between p-2 rounded-md my-1 cursor-pointer ${selectedTechnicians[exam?.id]?.some((tech) => tech.id === technician.id)
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
                  }`}
                onClick={() => handleTechnicianSelection(exam.id, technician)}
              >
                <div>
                  <p className="text-sm font-medium">{technician.nome_completo}</p>
                  <p className="text-xs text-gray-600">{technician.cargo}</p>
                </div>
                {selectedTechnicians[exam?.id]?.some((tech) => tech.id === technician.id) && (
                  <Badge variant="secondary" className="text-xs">
                    Selecionado
                  </Badge>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
        {/* Botões */}
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              // onSave(formData);
              handleSave();
            }}
            disabled={isProcessing}
            className="bg-akin-turquoise hover:bg-akin-turquoise/80"
          >
           {isProcessing ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
