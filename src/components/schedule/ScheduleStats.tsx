"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Activity,
  Clock,
  DollarSign
} from "lucide-react";

interface ScheduleStatsProps {
  schedules: ScheduleType[];
  isLoading?: boolean;
}

export function ScheduleStats({ schedules, isLoading }: ScheduleStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const today = new Date();
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todaySchedules = schedules.filter(s => {
    if (!s.Exame || s.Exame.length === 0) return false;
    const scheduleDate = new Date(s.Exame[0].data_agendamento);
    return scheduleDate.toDateString() === today.toDateString();
  });

  const thisWeekSchedules = schedules.filter(s => {
    if (!s.Exame || s.Exame.length === 0) return false;
    const scheduleDate = new Date(s.Exame[0].data_agendamento);
    return scheduleDate >= thisWeek;
  });

  const thisMonthSchedules = schedules.filter(s => {
    if (!s.Exame || s.Exame.length === 0) return false;
    const scheduleDate = new Date(s.Exame[0].data_agendamento);
    return scheduleDate >= thisMonth;
  });

  const totalRevenue = schedules.reduce((total, schedule) =>
    total + (schedule.Exame?.reduce((examTotal, exam) => examTotal + (exam.Tipo_Exame?.preco || 0), 0) || 0), 0
  );

  const averageExamsPerSchedule = schedules.length > 0
    ? schedules.reduce((total, s) => total + (s.Exame?.length || 0), 0) / schedules.length
    : 0;

  // Calculate trends (mock data for demonstration)
  const weeklyGrowth = 15; // This would be calculated from historical data
  const monthlyGrowth = 25;

  const getTimeSlotDistribution = () => {
    const slots = {
      morning: { label: "Manhã (08:00-12:00)", count: 0 },
      afternoon: { label: "Tarde (12:00-18:00)", count: 0 },
      evening: { label: "Noite (18:00-22:00)", count: 0 }
    };

    schedules.forEach(schedule => {
      if (schedule.Exame && schedule.Exame.length > 0) {
        const hour = parseInt(schedule.Exame[0].hora_agendamento.split(':')[0]);
        if (hour >= 8 && hour < 12) slots.morning.count++;
        else if (hour >= 12 && hour < 18) slots.afternoon.count++;
        else if (hour >= 18 && hour < 22) slots.evening.count++;
      }
    });

    return slots;
  };

  const timeSlots = getTimeSlotDistribution();
  const maxSlotCount = Math.max(timeSlots.morning.count, timeSlots.afternoon.count, timeSlots.evening.count);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Resumo Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
              <div className="text-sm text-blue-700">Total Pendentes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{todaySchedules.length}</div>
              <div className="text-sm text-green-700">Para Hoje</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Esta Semana</span>
              <span className="font-medium">{thisWeekSchedules.length}</span>
            </div>
            <Progress value={(thisWeekSchedules.length / schedules.length) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Este Mês</span>
              <span className="font-medium">{thisMonthSchedules.length}</span>
            </div>
            <Progress value={(thisMonthSchedules.length / schedules.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Distribuição por Horário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(timeSlots).map(([key, slot]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{slot.label}</span>
                <span className="font-medium">{slot.count}</span>
              </div>
              <Progress
                value={maxSlotCount > 0 ? (slot.count / maxSlotCount) * 100 : 0}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Visão Financeira
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA',
                notation: 'compact',
                maximumFractionDigits: 0
              }).format(totalRevenue)}
            </div>
            <div className="text-sm text-green-700">Receita Potencial Total</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium">Ticket Médio</div>
              <div className="text-gray-600">
                {schedules.length > 0
                  ? new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(totalRevenue / schedules.length)
                  : 'AOA 0'
                }
              </div>
            </div>
            <div>
              <div className="font-medium">Exames/Agend.</div>
              <div className="text-gray-600">{averageExamsPerSchedule.toFixed(1)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-medium">Crescimento Semanal</div>
              <div className="text-sm text-gray-600">Comparado à semana anterior</div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{weeklyGrowth}%
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <div className="font-medium">Crescimento Mensal</div>
              <div className="text-sm text-gray-600">Comparado ao mês anterior</div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{monthlyGrowth}%
            </Badge>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">
              🎯 Meta do Mês: 150 agendamentos
            </div>
            <Progress
              value={(schedules.length / 150) * 100}
              className="h-2 mt-2"
            />
            <div className="text-xs text-yellow-700 mt-1">
              {Math.round((schedules.length / 150) * 100)}% concluído
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
