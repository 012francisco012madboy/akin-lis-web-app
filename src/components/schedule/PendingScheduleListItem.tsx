"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, User, Phone, CreditCard, Stethoscope, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { scheduleRoutes } from "@/Api/Routes/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PendingScheduleListItemProps {
  schedule: ScheduleType;
}

export function PendingScheduleListItem({ schedule }: PendingScheduleListItemProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (scheduleId: number) => scheduleRoutes.acceptSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-schedules'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ scheduleId, reason }: { scheduleId: number; reason: string }) =>
      scheduleRoutes.rejectSchedule(scheduleId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-schedules'] });
      setShowRejectDialog(false);
      setRejectReason("");
    },
  });

  const handleAccept = () => {
    acceptMutation.mutate(schedule.id);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      rejectMutation.mutate({ scheduleId: schedule.id, reason: rejectReason });
    }
  };

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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "HH:mm");
  };

  const getTotalPrice = () => {
    return schedule.Exame?.reduce((total, exam) => total + (exam.Tipo_Exame?.preco || 0), 0) || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border rounded-lg bg-white hover:shadow-md transition-all duration-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                  {getPatientInitials()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {schedule.Paciente?.nome_completo}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{schedule.Paciente?.numero_identificacao}</span>
                  <span>{getPatientAge()}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>
                    {schedule.Exame && schedule.Exame.length > 0
                      ? formatDate(schedule.Exame[0].data_agendamento)
                      : "Data não disponível"
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>
                    {schedule.Exame && schedule.Exame.length > 0
                      ? formatTime(schedule.Exame[0].hora_agendamento)
                      : "Hora não disponível"
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  <span>{schedule.Exame?.length || 0} exames</span>
                </div>
              </div>

              <Badge className={getStatusColor(schedule.status)} variant="outline">
                <AlertCircle className="w-3 h-3 mr-1" />
                {schedule.status}
              </Badge>

              <div className="text-right hidden lg:block">
                <div className="font-semibold text-green-700">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(getTotalPrice())}
                </div>
                <div className="text-xs text-gray-500">Valor total</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Aceitar
              </Button>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={rejectMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Recusar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recusar Agendamento</DialogTitle>
                    <DialogDescription>
                      Por favor, forneça um motivo para recusar este agendamento.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reject-reason">Motivo da recusa</Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="Digite o motivo da recusa..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectReason.trim() || rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? "Recusando..." : "Confirmar Recusa"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Mobile info */}
          <div className="md:hidden mt-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                {schedule.Exame && schedule.Exame.length > 0
                  ? formatDate(schedule.Exame[0].data_agendamento)
                  : "Data não disponível"
                }
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {schedule.Exame && schedule.Exame.length > 0
                  ? formatTime(schedule.Exame[0].hora_agendamento)
                  : "Hora não disponível"
                }
              </span>
            </div>
            <div className="font-semibold text-green-700">
              {new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA'
              }).format(getTotalPrice())}
            </div>
          </div>
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">Informações do Paciente</Label>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sexo:</span>
                    <span className="font-medium">
                      {schedule.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contacto:</span>
                    <span className="font-medium">
                      {schedule.Paciente?.contacto_telefonico || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Exames Solicitados</Label>
                <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                  {schedule.Exame?.map((exam) => (
                    <div key={exam.id} className="flex justify-between text-sm p-2 bg-white rounded">
                      <span>{exam.Tipo_Exame?.nome}</span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(exam.Tipo_Exame?.preco || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
