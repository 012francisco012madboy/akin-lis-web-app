"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Grid3X3,
  List,
  RefreshCw,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { scheduleRoutes } from "@/Api/Routes/schedule/index.routes";
import { PendingScheduleCard } from "@/components/schedule/PendingScheduleCard";
import { PendingScheduleTable } from "@/components/schedule/PendingScheduleTable";
import { ScheduleFilters } from "@/components/schedule/ScheduleFilters";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { BulkActions } from "@/components/schedule/BulkActions";
import { useScheduleFilters } from "@/hooks/useScheduleFilters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Request() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSchedules, setSelectedSchedules] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);

  const {
    data: schedules = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['pending-schedules'],
    queryFn: () => scheduleRoutes.getPendingSchedules(),
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Use custom hook for filtering
  const {
    filteredSchedules,
    filters,
    handleSearch,
    handleFilterChange,
  } = useScheduleFilters(schedules);

  // Calculate statistics
  const totalSchedules = schedules.length;
  const totalExams = schedules.reduce((total, schedule) => total + (schedule.Exame?.length || 0), 0);
  const totalRevenue = schedules.reduce((total, schedule) =>
    total + (schedule.Exame?.reduce((examTotal, exam) => examTotal + (exam.Tipo_Exame?.preco || 0), 0) || 0), 0
  );

  // Get today's schedules
  const todaySchedules = schedules.filter(schedule => {
    if (!schedule.Exame || schedule.Exame.length === 0) return false;
    const scheduleDate = new Date(schedule.Exame[0].data_agendamento);
    const today = new Date();
    return scheduleDate.toDateString() === today.toDateString();
  });

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar agendamentos pendentes.
            <Button
              variant="link"
              className="p-0 h-auto ml-2"
              onClick={() => refetch()}
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Agendamentos Pendentes
          </h1>
          <p className="text-gray-600 mt-1 text-wrap">
            Gerencie e processe agendamentos que aguardam aprovação
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showStats ? "Ocultar" : "Mostrar"} Estatísticas
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalSchedules}
            </div>
            <p className="text-xs text-muted-foreground">
              agendamentos aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : todaySchedules.length}
            </div>
            <p className="text-xs text-muted-foreground">
              agendamentos para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exames</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? <Skeleton className="h-8 w-16" /> : totalExams}
            </div>
            <p className="text-xs text-muted-foreground">
              exames pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Potencial</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA',
                  notation: 'compact',
                  maximumFractionDigits: 0
                }).format(totalRevenue)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              valor total pendente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistics (conditionally shown) */}
      {showStats && (
        <ScheduleStats schedules={schedules} isLoading={isLoading} />
      )}

      {/* Bulk Actions */}
      {!isLoading && filteredSchedules.length > 0 && (
        <BulkActions
          schedules={filteredSchedules}
          selectedSchedules={selectedSchedules}
          onSelectionChange={setSelectedSchedules}
        />
      )}

      {/* Filters */}
      <ScheduleFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        totalSchedules={totalSchedules}
        filteredCount={filteredSchedules.length}
      />

      {/* View Toggle and Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <div className="text-sm text-gray-600">
            {filteredSchedules.length} de {totalSchedules} agendamentos
          </div>
        </div>

        <Separator className="my-4" />

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredSchedules.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {totalSchedules === 0
                  ? "Não há agendamentos pendentes no momento."
                  : "Tente ajustar os filtros para encontrar agendamentos."
                }
              </p>
              {filters.searchQuery && (
                <Button variant="outline" onClick={() => handleSearch("")}>
                  Limpar busca
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <>
            <TabsContent value="grid" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSchedules.map((schedule) => (
                  <PendingScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <PendingScheduleTable schedules={filteredSchedules} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}