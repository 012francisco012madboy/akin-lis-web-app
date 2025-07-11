"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, User, Phone, CreditCard, Stethoscope, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { scheduleRoutes } from "@/Api/Routes/schedule/index.routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PendingScheduleCardProps {
  schedule: ScheduleType;
}

export function PendingScheduleCard({ schedule }: PendingScheduleCardProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (scheduleId: number) => scheduleRoutes.acceptSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-schedules'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ scheduleId }: { scheduleId: number}) =>
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
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
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
    <Card className="w-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                {getPatientInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {schedule.Paciente?.nome_completo}
              </h3>
              <div className="flex flex-wrap items-center space-y-2  space-x-3 text-sm text-gray-600">
                <span className="flex items-center bg-white px-2 py-1 rounded-md shadow-sm">
                  <User className="w-3 h-3 mr-1 text-blue-600" />
                  {schedule.Paciente?.numero_identificacao}
                </span>
                <span className="bg-white px-2 py-1 rounded-md shadow-sm">
                  {getPatientAge()}
                </span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(schedule.status)} variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            {schedule.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {/* Data e Hora */}
        <div className="flex flex-col lg:flex-row  items-start lg:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Data</p>
              <p className="font-semibold text-gray-900">
                {schedule.Exame && schedule.Exame.length > 0
                  ? formatDate(schedule.Exame[0].data_agendamento)
                  : "Data não disponível"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Hora</p>
              <p className="font-semibold text-gray-900">
                {schedule.Exame && schedule.Exame.length > 0
                  ? formatTime(schedule.Exame[0].hora_agendamento)
                  : "Hora não disponível"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Informações do Paciente */}
        <div className="flex flex-col lg:flex-row  flex-wrap">
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">Sexo</Label>
            <p className="font-semibold text-gray-900 mt-1">
              {schedule.Paciente?.id_sexo === 1 ? "Masculino" : "Feminino"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-xs text-gray-600 uppercase tracking-wide">Contacto</Label>
            <p className="font-semibold text-gray-900 flex items-center mt-1">
              <Phone className="w-4 h-4 mr-2 text-green-600" />
              {schedule.Paciente?.contacto_telefonico || "N/A"}
            </p>
          </div>
        </div>

        <Separator />

        {/* Exames */}
        <div>
          <Label className="text-gray-700 flex items-center mb-3 font-semibold">
            <div className="p-1.5 bg-purple-100 rounded-lg mr-2">
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </div>
            Exames Solicitados ({schedule.Exame?.length || 0})
          </Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {schedule.Exame?.map((exam, index) => (
              <div key={exam.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-sm transition-shadow">
                <div>
                  <p className="text-sm font-medium text-gray-900">{exam.Tipo_Exame?.nome}</p>
                  <p className="text-xs text-gray-500">Código: #{exam.id}</p>
                </div>
                <span className="text-sm text-purple-700 font-bold bg-purple-100 px-2 py-1 rounded-md">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    notation: 'compact'
                  }).format(exam.Tipo_Exame?.preco || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Valor Total */}
        <div className="flex flex-col lg:flex-row  justify-between items-start lg:items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
          <span className="flex items-center font-semibold text-green-800">
            <div className="p-1.5 bg-green-500 rounded-lg mr-2">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            Valor Total
          </span>
          <span className="font-bold text-xl text-green-700">
            {new Intl.NumberFormat('pt-AO', {
              style: 'currency',
              currency: 'AOA'
            }).format(getTotalPrice())}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col lg:flex-row w-full gap-2">
        <Button
          onClick={handleAccept}
          disabled={acceptMutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {acceptMutation.isPending ? "Aceitando..." : "Aceitar"}
        </Button>

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              disabled={rejectMutation.isPending}
            >
              <XCircle className="w-4 h-4 mr-2" />
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
      </CardFooter>
    </Card>
  );
}
