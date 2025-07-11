"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, User, Phone, CreditCard, Stethoscope, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { scheduleRoutes } from "@/Api/Routes/schedule/index.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PendingScheduleTableProps {
  schedules: ScheduleType[];
}

export function PendingScheduleTable({ schedules }: PendingScheduleTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm h-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Paciente
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Data/Hora
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Exames
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6 hidden lg:table-cell text-right">
                <div className="flex items-center gap-2 justify-end">
                  <CreditCard className="w-4 h-4" />
                  Valor
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Status
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4 px-6 text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <PendingScheduleTableRow key={schedule.id} schedule={schedule} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PendingScheduleTableRowProps {
  schedule: ScheduleType;
}

function PendingScheduleTableRow({ schedule }: PendingScheduleTableRowProps) {
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
    mutationFn: ({ scheduleId }: { scheduleId: number }) =>
      scheduleRoutes.rejectSchedule(scheduleId),
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
      rejectMutation.mutate({ scheduleId: schedule.id });
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
    <Collapsible asChild>
      <>
        <TableRow className="hover:bg-gray-50">
          {/* Paciente */}
          <TableCell>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                  {getPatientInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {schedule.Paciente?.nome_completo}
                </div>
                <div className="text-sm text-gray-500 space-x-2">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {schedule.Paciente?.numero_identificacao}
                  </span>
                  <span className="md:hidden">• {getPatientAge()}</span>
                </div>
                {/* Info adicional para mobile */}
                <div className="md:hidden mt-2 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {schedule.Exame && schedule.Exame.length > 0
                      ? `${formatDate(schedule.Exame[0].data_agendamento)} às ${formatTime(schedule.Exame[0].hora_agendamento)}`
                      : "Data não disponível"
                    }
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      <span>{schedule.Exame?.length || 0} exames</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: 'AOA',
                        notation: 'compact'
                      }).format(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>

          {/* Data/Hora */}
          <TableCell className="hidden md:table-cell">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <CalendarDays className="w-4 h-4 mr-1 text-blue-600" />
                <span>
                  {schedule.Exame && schedule.Exame.length > 0
                    ? formatDate(schedule.Exame[0].data_agendamento)
                    : "N/A"
                  }
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1 text-blue-600" />
                <span>
                  {schedule.Exame && schedule.Exame.length > 0
                    ? formatTime(schedule.Exame[0].hora_agendamento)
                    : "N/A"
                  }
                </span>
              </div>
            </div>
          </TableCell>

          {/* Exames */}
          <TableCell className="hidden lg:table-cell">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-50 px-2 py-1 rounded-md flex items-center">
                <Stethoscope className="w-4 h-4 mr-1 text-blue-600" />
                <span className="text-sm font-medium">{schedule.Exame?.length || 0}</span>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </TableCell>

          {/* Valor */}
          <TableCell className="hidden lg:table-cell">
            <div className="text-right">
              <div className="font-semibold text-green-700">
                {new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA'
                }).format(getTotalPrice())}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </TableCell>

          {/* Status */}
          <TableCell>
            <Badge className={getStatusColor(schedule.status)} variant="outline">
              <AlertCircle className="w-3 h-3 mr-1" />
              {schedule.status}
            </Badge>
          </TableCell>

          {/* Ações */}
          <TableCell>
            <div className=" flex flex-col md:flex-row gap-2 items-start justify-center md:space-x-2">
              <Button
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {acceptMutation.isPending ? "..." : "Aceitar"}
              </Button>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild className="m-0">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={rejectMutation.isPending}
                    className="w-full px-2 py-1 text-xs"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    Recusar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Recusar Agendamento</DialogTitle>
                    <DialogDescription>
                      Por favor, forneça um motivo para recusar este agendamento de {schedule.Paciente?.nome_completo}.
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

              {/* Botão expandir para telas pequenas */}
              <CollapsibleTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="p-1">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </TableCell>
        </TableRow>

        {/* Detalhes expandidos */}
        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={6} className="bg-gray-50 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 font-medium">Informações do Paciente</Label>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Idade:</span>
                      <span className="font-medium">{getPatientAge()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sexo:</span>
                      <span className="font-medium">
                        {schedule.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contacto:</span>
                      <span className="font-medium flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {schedule.Paciente?.contacto_telefonico || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600 font-medium">Exames Solicitados</Label>
                  <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                    {schedule.Exame?.map((exam) => (
                      <div key={exam.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium text-sm">{exam.Tipo_Exame?.nome}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(exam.data_agendamento)} às {formatTime(exam.hora_agendamento)}
                          </div>
                        </div>
                        <span className="font-semibold text-blue-600 text-sm">
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
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
