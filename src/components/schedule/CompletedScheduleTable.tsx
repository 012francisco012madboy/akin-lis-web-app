"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  CreditCard,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  FileText,
  DollarSign,
  UserCheck
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompletedScheduleTableProps {
  schedules: CompletedScheduleType[];
  onViewDetails?: (schedule: CompletedScheduleType) => void;
  onViewReport?: (schedule: CompletedScheduleType) => void;
}

export function CompletedScheduleTable({
  schedules,
  onViewDetails,
  onViewReport
}: CompletedScheduleTableProps) {
  const [selectedSchedules, setSelectedSchedules] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSchedules(schedules.map(s => s.id));
    } else {
      setSelectedSchedules([]);
    }
  };

  const handleSelectSchedule = (scheduleId: number, checked: boolean) => {
    if (checked) {
      setSelectedSchedules(prev => [...prev, scheduleId]);
    } else {
      setSelectedSchedules(prev => prev.filter(id => id !== scheduleId));
    }
  };

  const getPatientAge = (birthDate: string) => {
    if (!birthDate) return "N/A";
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return `${age} anos`;
  };

  const getPatientInitials = (name: string) => {
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
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
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
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Agendamentos Concluídos</span>
          <div className="flex items-center gap-2">
            {selectedSchedules.length > 0 && (
              <Badge variant="outline">
                {selectedSchedules.length} selecionado(s)
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSchedules.length === schedules.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Exames</TableHead>
                <TableHead>Data do Agendamento</TableHead>
                <TableHead>Status dos Exames</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => {
                const totalValue = schedule.Exame?.reduce((total, exam) =>
                  total + (exam.Tipo_Exame?.preco || 0), 0
                ) || 0;

                const completedExams = schedule.Exame?.filter(exam => exam.status === "CONCLUIDO").length || 0;
                const totalExams = schedule.Exame?.length || 0;

                const paidExams = schedule.Exame?.filter(exam => exam.status_pagamento === "PAGO").length || 0;

                const hasAllocatedTechnician = schedule.Exame?.some(exam => exam.id_tecnico_alocado);

                return (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedSchedules.includes(schedule.id)}
                        onCheckedChange={(checked) =>
                          handleSelectSchedule(schedule.id, checked as boolean)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" alt={schedule.Paciente?.nome_completo} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getPatientInitials(schedule.Paciente?.nome_completo || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {schedule.Paciente?.nome_completo || "Nome não disponível"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {getPatientAge(schedule.Paciente?.data_nascimento || "")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {schedule.Paciente?.contacto_telefonico || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {totalExams} exame(s)
                        </div>
                        <div className="text-xs text-gray-500">
                          {schedule.Exame?.slice(0, 2).map((exam, idx) => (
                            <div key={idx} className="truncate">
                              {exam.Tipo_Exame?.nome || "Exame não especificado"}
                            </div>
                          ))}
                          {totalExams > 2 && (
                            <div className="text-blue-600">
                              +{totalExams - 2} mais
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {schedule.Exame?.slice(0, 1).map((exam, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {format(new Date(exam.data_agendamento), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              {exam.hora_agendamento || "N/A"}
                            </div>
                          </div>
                        ))}
                        {totalExams > 1 && (
                          <div className="text-xs text-blue-600">
                            Ver todas as datas
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {completedExams}/{totalExams} concluídos
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {schedule.Exame?.slice(0, 2).map((exam, idx) => (
                            <div key={idx}>
                              {getExamStatusBadge(exam.status)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {paidExams}/{totalExams} pagos
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {schedule.Exame?.slice(0, 2).map((exam, idx) => (
                            <div key={idx}>
                              {getPaymentStatusBadge(exam.status_pagamento)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(totalValue)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {hasAllocatedTechnician ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Alocado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Não alocado
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails?.(schedule)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewReport?.(schedule)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Gerar Relatório
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
