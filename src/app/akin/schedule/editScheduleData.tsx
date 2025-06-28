"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Combobox } from "@/components/combobox/comboboxExam";
import { useEffect, useState } from "react";
import { ILabTechnician } from "./tecnico";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { _axios } from "@/Api/axios.config";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";
import { getAllDataInCookies } from "@/utils/get-data-in-cookies";

//Precisa de ser atualizado o Typescript desse componente e aplicar refatoração de codigo para melhorar a legibilidade - (Mario SALVADOR)
export function EditScheduleFormModal({
  open,
  active,
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
      type: "", // Adicione o campo type
      id_tipo_exame: 0, // Adicione o campo id_tipo_exame
    }
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTechnicians, setSelectedTechnicians] = useState<
    Record<string, any[]>
  >({});
  const [selectedChiefs, setSelectedChiefs] = useState<Record<string, any[]>>({});

  const queryClient = useQueryClient();
  const userRole = getAllDataInCookies().userRole;
  const chefe = "CHEFE";
  const recepcionista = "RECEPCIONISTA";

  // Fetch dos chefes de laboratório
  const chief = useQuery({
    queryKey: ["lab-chiefs"],
    queryFn: async () => {
      const response = await _axios.get<ILabTechnician[]>("lab-chiefs");
      return response.data;
    },
    refetchInterval: 30000 * 5, // Atualiza a cada 5 minutos
  });

  // Fetch dos técnicos
  const technicians = useQuery({
    queryKey: ["lab-techs"],
    queryFn: async () => {
      const response = await _axios.get<ILabTechnician[]>("lab-technicians");
      return response.data;
    },
    refetchInterval: 30000 * 5, // Atualiza a cada 5 minutos
  });

  // Fetch dos exames
  const exams = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const response = await _axios.get("/exam-types");
      return response;
    },
    refetchInterval: 30000 * 5, // Atualiza a cada 5 minutos
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

  const handleTechnicianSelection = (examId: number, technician: ILabTechnician) => {
    setSelectedTechnicians((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((tech) => tech.id === technician.id);

      if (isAlreadySelected) {
        // Desselecionar o técnico
        return {
          ...prev,
          [examId]: [],
        };
      } else {
        // Selecionar o técnico (apenas um por exame)
        return {
          ...prev,
          [examId]: [technician],
        };
      }
    });
  };

  const handleChiefSelection = (examId: number, chief: ILabTechnician) => {
    setSelectedChiefs((prev) => {
      const currentSelection = prev[examId] || [];
      const isAlreadySelected = currentSelection.some((ch) => ch.id === chief.id);

      if (isAlreadySelected) {
        // Desselecionar o chefe
        return {
          ...prev,
          [examId]: [],
        };
      } else {
        // Selecionar o chefe (apenas um por exame)
        return {
          ...prev,
          [examId]: [chief],
        };
      }
    });
  };

  const handleExamSelection = (selectedExam: any) => {
    setFormData({ ...formData, type: selectedExam?.id || "" });
  };

  if (technicians.isLoading || exams.isLoading) return <></>;
  if (technicians.isError || exams.isError) {
    ___showErrorToastNotification({
      message: "Erro ao carregar dados"
    });
    return <></>;
  }

  const filteredTechnicians = Array.isArray(technicians.data)
    ? technicians.data.filter(
      (tech) =>
        tech.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const filteredChiefs = Array.isArray(chief.data)
    ? chief.data.filter(
      (chief) =>
        chief.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chief.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const handleSave = () => {
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);

    if (selectedDate < currentDate) {
      ___showErrorToastNotification({ message: "A data do exame não pode ser no passado." });
      return;
    }

    const formattedValue: Record<string, any> = {};

    formattedValue.data_agendamento = formData.date;
    formattedValue.hora_agendamento = formData.time;

    // Só atualiza o técnico se houver um selecionado, senão mantém o original
    const selectedTech = selectedTechnicians[examId]?.[0];
    if (selectedTech) {
      formattedValue.id_tecnico_alocado = selectedTech.id;
    }

    // Só atualiza o chefe se houver um selecionado, senão mantém o original
    const selectedChief = selectedChiefs[examId]?.[0];
    if (selectedChief) {
      formattedValue.id_chefe_alocado = selectedChief.id;
    }

    if (formData.status !== exam.status) {
      formattedValue.status = formData.status || "PENDENTE";
    }
    if (formData.type !== exam.type) {
      formattedValue.id_tipo_exame = formData.type || formData.id;
    }

    saveScheduleMutation.mutate(formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className=" max-w-[600px] max-h-[90%] overflow-auto [&::-webkit-scrollbar]:hidden" >
        <DialogHeader>
          <h2>
            Editar Exame - <span className="text-zinc-600 font-semibold">{formData.name || "Exame"}</span>
          </h2>
        </DialogHeader>

        {/* Formulário */}
        {
          userRole === chefe ? (
            <>
              {/* Alocação de Tecnico de laboratório */}
              <div className="card gap-3 w-full">
                <label htmlFor="technicianId" className="font-bold block mb-2">
                  Técnico de Laboratório Alocado
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

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alocar novo Tecnico de laboratório</label>
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
                        <p className="text-sm font-medium">{technician.nome}</p>
                        <p className="text-xs text-gray-600">{technician.tipo}</p>
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
            </>
          ) : (
            <>
              <div className="card gap-3 w-full">
                <label htmlFor="type" className="font-bold block mb-2">
                  Alterar  Exame
                </label>
                <Combobox
                  data={exams.data?.data.data || []}
                  displayKey="nome"
                  onSelect={handleExamSelection}
                  placeholder="Selecione o novo exame"
                  clearLabel="Limpar"
                />
              </div>
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
                <label htmlFor="status" className="font-bold block mb-2">
                  Estado do Exame
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={formData.status}
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-nonefocus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                >
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="CONCLUIDO">CONCLUIDO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </div>
            </>
          )
        }

        {
          (recepcionista === userRole) && (
            <>
              {/* Alocação de Chefe de laboratório */}
              <div className="card gap-3 w-full">
                <label htmlFor="chiefId" className="font-bold block mb-2">
                  Chefe de Laboratório Alocado
                </label>
                <Input
                  id="chiefId"
                  name="chiefId"
                  value={techName}
                  placeholder="Nome do Chefe de Laboratório"
                  className="w-full h-12 px-4 bg-gray-50 text-black placeholder:text-black disabled:text-black  focus-visible:ring-0 ring-0 font-semibold text-xl "
                  disabled
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alocar novo chefe de laboratório</label>
                <Input
                  placeholder="Pesquise por nome ou cargo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="max-h-40 border rounded-md p-2 overflow-auto">
                  {filteredChiefs.map((chief) => (
                    <div
                      key={chief.id}
                      className={`flex flex-col items-start md:flex-row justify-between p-2 rounded-md my-1 cursor-pointer ${selectedChiefs[exam?.id]?.some((tech) => tech.id === chief.id)
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                        }`}
                      onClick={() => { handleChiefSelection(exam.id, chief) }}
                    >
                      <div>
                        <p className="text-sm font-medium">{chief.nome}</p>
                        <p className="text-xs text-gray-600">{chief.tipo}</p>
                      </div>
                      {selectedChiefs[exam?.id]?.some((tech) => tech.id === chief.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </>
          )
        }

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
