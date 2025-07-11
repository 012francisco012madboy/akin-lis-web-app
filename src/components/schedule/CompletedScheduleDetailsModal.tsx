"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Edit3,
  Save,
  X,
  Mail,
  Calendar,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { _axios } from "@/Api/axios.config";
import {
  ___showSuccessToastNotification,
  ___showErrorToastNotification
} from "@/lib/sonner";
import { getAllDataInCookies } from "@/utils/get-data-in-cookies";
import { labTechniciansRoutes } from "@/Api/Routes/lab-technicians/index.routes";
import { labChiefRoutes } from "@/Api/Routes/lab-chief/index.routes";
import { examRoutes } from "@/Api/Routes/Exam/index.route";

interface CompletedScheduleDetailsModalProps {
  schedule: CompletedScheduleType | null;
  isOpen: boolean;
  onClose: () => void;
}


export function CompletedScheduleDetailsModal({
  schedule,
  isOpen,
  onClose,
}: CompletedScheduleDetailsModalProps) {
  const [editingExam, setEditingExam] = useState<number | null>(null);
  const [editedExam, setEditedExam] = useState<EditableExam | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [selectedChief, setSelectedChief] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const userRole = getAllDataInCookies().userRole;
  const isReceptionist = userRole === "RECEPCIONISTA";
  const isLabChief = userRole === "CHEFE";

  // Fetch técnicos de laboratório
  const { data: technicians, isLoading: loadingTechnicians } = useQuery({
    queryKey: ["lab-technicians"],
    queryFn: async () => {
      const response = await labTechniciansRoutes.getAllLabTechnicians();
      return response.data;
    },
    enabled: isLabChief,
  });

  // Fetch chefes de laboratório
  const { data: labChiefs, isLoading: loadingChiefs } = useQuery({
    queryKey: ["lab-chiefs"],
    queryFn: async () => {
      const response = await labChiefRoutes.getAllLabChief();
      return response;
    },
    enabled: isReceptionist,
  });

  // Mutação para atualizar exame
  const updateExamMutation = useMutation({
    mutationFn: async (data: { examId: number; updates: EditableExam }) => {
      const response = await examRoutes.editExam(data.examId, data.updates);
      return response;
    },
    onSuccess: () => {
      ___showSuccessToastNotification({
        message: "Exame atualizado com sucesso!"
      });
      queryClient.invalidateQueries({ queryKey: ["completed-schedules"] });
      setEditingExam(null);
      setEditedExam(null);
    },
    onError: () => {
      ___showErrorToastNotification({
        message: "Erro ao atualizar exame. Tente novamente."
      });
    },
  });

  // Mutação para alocar técnico
  const allocateTechnicianMutation = useMutation({
    mutationFn: async (data: { examId: number; technicianId: string }) => {
      const response = await _axios.patch(`/exams/${data.examId}`, {
        id_tecnico_alocado: data.technicianId,
      });
      return response.data;
    },
    onSuccess: () => {
      ___showSuccessToastNotification({
        message: "Técnico alocado com sucesso!"
      });
      queryClient.invalidateQueries({ queryKey: ["completed-schedules"] });
      setSelectedTechnician(null);
    },
    onError: () => {
      ___showErrorToastNotification({
        message: "Erro ao alocar técnico. Tente novamente."
      });
    },
  });

  // Mutação para alocar chefe
  const allocateChiefMutation = useMutation({
    mutationFn: async (data: { scheduleId: number; chiefId: string }) => {
        const response = await labChiefRoutes.allocateLabChief(
          data.scheduleId,
          data.chiefId,
        )
    },
    onSuccess: () => {
      ___showSuccessToastNotification({
        message: "Chefe alocado com sucesso!"
      });
      queryClient.invalidateQueries({ queryKey: ["completed-schedules"] });
      setSelectedChief(null);
    },
    onError: () => {
      ___showErrorToastNotification({
        message: "Erro ao alocar chefe. Tente novamente."
      });
    },
  });

  if (!schedule) return null;

  const getPatientAge = () => {
    if (!schedule.Paciente?.data_nascimento) return "N/A";
    const birthDate = new Date(schedule.Paciente.data_nascimento);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return `${age} anos`;
  };

  const getPatientInitials = () => {
    const name = schedule.Paciente?.nome_completo || "";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getExamStatusBadge = (status: string) => {
    switch (status) {
      case "CONCLUIDO":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case "PENDENTE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "CANCELADO":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAGO":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Pago
          </Badge>
        );
      case "PENDENTE":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "CANCELADO":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const startEditExam = (exam: CompletedExamType) => {
    setEditingExam(exam.id);
    setEditedExam({
      id: exam.id,
      status: exam.status,
      data_agendamento: exam.data_agendamento,
      hora_agendamento: exam.hora_agendamento,
      status_pagamento: exam.status_pagamento,
      id_tecnico_alocado: exam.id_tecnico_alocado,
    });
  };

  const saveExamChanges = () => {
    if (!editedExam) return;

    updateExamMutation.mutate({
      examId: editedExam.id,
      updates: {
        id: editedExam.id,
        id_tecnico_alocado: editedExam.id_tecnico_alocado,
        status: editedExam.status,
        data_agendamento: editedExam.data_agendamento,
        hora_agendamento: editedExam.hora_agendamento,
        status_pagamento: editedExam.status_pagamento,
      },
    });
  };

  const cancelEdit = () => {
    setEditingExam(null);
    setEditedExam(null);
  };

  const handleAllocateTechnician = (examId: number) => {
    if (!selectedTechnician) return;
    allocateTechnicianMutation.mutate({
      examId,
      technicianId: selectedTechnician,
    });
  };

  const handleAllocateChief = () => {
    if (!selectedChief) return;
    allocateChiefMutation.mutate({
      scheduleId: schedule.id,
      chiefId: selectedChief,
    });
  };

  const getTechnicianName = (technicianId: string | null) => {
    if (!technicianId || !technicians) return "Não alocado";
    const technician = technicians.find(t => t.id === technicianId);
    return technician?.nome || "Técnico não encontrado";
  };

  const getChiefName = (chiefId: string | null) => {
    if (!chiefId || !labChiefs) return "Não alocado";
    const chief = labChiefs.find(c => c.id === chiefId);
    return chief?.nome || "Chefe não encontrado";
  };

  const filteredTechnicians = technicians?.filter(tech =>
    tech.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredChiefs = labChiefs?.filter(chief =>
    chief.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chief.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalValue = schedule.Exame?.reduce((total, exam) =>
    total + (exam.Tipo_Exame?.preco || 0), 0
  ) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detalhes do Agendamento #{schedule.id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Informações do Paciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt={schedule.Paciente?.nome_completo} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {getPatientInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nome Completo</Label>
                      <p className="font-semibold">{schedule.Paciente?.nome_completo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Idade</Label>
                      <p className="font-semibold">{getPatientAge()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">BI</Label>
                      <p className="font-semibold">{schedule.Paciente?.numero_identificacao}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                      <p className="font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {schedule.Paciente?.contacto_telefonico}
                      </p>
                    </div>
                    {schedule.Paciente?.email && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email</Label>
                        <p className="font-semibold flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {schedule.Paciente.email}
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Sexo</Label>
                      <p className="font-semibold">{schedule.Paciente?.sexo?.nome}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Agendamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Informações do Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Criação</Label>
                    <p className="font-semibold">
                      {format(new Date(schedule.criado_aos), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                    <p className="font-semibold text-lg text-green-600">
                      {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: 'AOA'
                      }).format(totalValue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alocação de Chefe (apenas para Recepcionista) */}
            {isReceptionist && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Chefe Alocado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Chefe Atual</Label>
                      <p className="font-semibold">
                        {getChiefName(schedule.id_chefe_alocado || null)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={selectedChief || ""} onValueChange={setSelectedChief}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecionar novo chefe" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredChiefs.map((chief) => (
                            <SelectItem key={chief.id} value={chief.id}>
                              {chief.nome} - {chief.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAllocateChief}
                        disabled={!selectedChief || allocateChiefMutation.isPending}
                      >
                        Alocar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Exames */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Exames ({schedule.Exame?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedule.Exame?.map((exam, index) => (
                    <div key={exam.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">
                          {exam.Tipo_Exame?.nome || "Exame não especificado"}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getExamStatusBadge(exam.status)}
                          {getPaymentStatusBadge(exam.status_pagamento)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditExam(exam)}
                            disabled={editingExam === exam.id}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      {editingExam === exam.id && editedExam ? (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`status-${exam.id}`}>Status</Label>
                              <Select
                                value={editedExam.status}
                                onValueChange={(value) =>
                                  setEditedExam(prev => prev ? { ...prev, status: value } : null)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                                  <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`payment-${exam.id}`}>Status do Pagamento</Label>
                              <Select
                                value={editedExam.status_pagamento}
                                onValueChange={(value) =>
                                  setEditedExam(prev => prev ? { ...prev, status_pagamento: value } : null)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                                  <SelectItem value="PAGO">Pago</SelectItem>
                                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`date-${exam.id}`}>Data do Agendamento</Label>
                              <Input
                                id={`date-${exam.id}`}
                                type="date"
                                value={editedExam.data_agendamento}
                                onChange={(e) =>
                                  setEditedExam(prev => prev ? { ...prev, data_agendamento: e.target.value } : null)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`time-${exam.id}`}>Hora do Agendamento</Label>
                              <Input
                                id={`time-${exam.id}`}
                                type="time"
                                value={editedExam.hora_agendamento}
                                onChange={(e) =>
                                  setEditedExam(prev => prev ? { ...prev, hora_agendamento: e.target.value } : null)
                                }
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="outline" onClick={cancelEdit}>
                              <X className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                            <Button
                              onClick={saveExamChanges}
                              disabled={updateExamMutation.isPending}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-600">Data e Hora</Label>
                            <p className="font-medium flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {format(new Date(exam.data_agendamento), "dd/MM/yyyy", { locale: ptBR })}
                              <Clock className="w-3 h-3 ml-2" />
                              {exam.hora_agendamento}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Preço</Label>
                            <p className="font-medium text-green-600">
                              {new Intl.NumberFormat('pt-AO', {
                                style: 'currency',
                                currency: 'AOA'
                              }).format(exam.Tipo_Exame?.preco || 0)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Técnico Alocado</Label>
                            <p className="font-medium">
                              {getTechnicianName(exam.id_tecnico_alocado)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Alocação de Técnico (apenas para Chefe) */}
                      {isLabChief && (
                        <div className="mt-4 pt-4 border-t">
                          <Label className="text-sm font-medium text-gray-600 mb-2 block">
                            Alocar Técnico
                          </Label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={selectedTechnician || ""}
                              onValueChange={setSelectedTechnician}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecionar técnico" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredTechnicians.map((technician) => (
                                  <SelectItem key={technician.id} value={technician.id}>
                                    {technician.nome} - {technician.tipo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handleAllocateTechnician(exam.id)}
                              disabled={!selectedTechnician || allocateTechnicianMutation.isPending}
                            >
                              Alocar
                            </Button>
                          </div>
                        </div>
                      )}

                      {index < (schedule.Exame?.length || 0) - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
