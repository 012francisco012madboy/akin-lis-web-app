

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FlaskConical,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  FileText,
  Users,
  Activity
} from "lucide-react";
import { ExamMetrics, generateExamMetrics } from "@/components/akin/lab-exams/ExamMetrics";
import { usePendingExams } from "@/hooks/usePendingExams";
import { ExamCard } from "@/components/akin/lab-exams/ExamCard";
import { ExamTable } from "@/components/akin/lab-exams/ExamTable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export default function LabExamsPage() {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const { data: pendingExams, isLoading, error, refetch } = usePendingExams();

  const examMetrics = generateExamMetrics();

  // Simulação de dados de exames recentes para o dashboard
  const recentExams = [
    {
      id: 1,
      patient: "Maria Silva",
      exam: "Hemograma Completo",
      time: "09:30",
      status: "Em Andamento",
      type: "progress"
    },
    {
      id: 2,
      patient: "João Santos",
      exam: "Glicemia",
      time: "10:15",
      status: "Concluído",
      type: "complete"
    },
    {
      id: 3,
      patient: "Ana Costa",
      exam: "Urina Tipo I",
      time: "11:00",
      status: "Pendente",
      type: "pending"
    }
  ];

  const getStatusBadge = (status: string, type: string) => {
    const variants = {
      complete: "bg-green-100 text-green-800 border-green-200",
      progress: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return variants[type as keyof typeof variants] || variants.pending;
  };

  const handleExamEdit = (exam: ExamsType) => {
    toast.info("Função de edição será implementada");
  };

  const handleExamView = (exam: ExamsType) => {
    toast.info("Função de visualização será implementada");
  };

  const handleExamStart = (exam: ExamsType) => {
    toast.info("Função de iniciar exame será implementada");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Dados atualizados com sucesso");
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exames Laboratoriais</h1>
          <p className="text-gray-600">Gestão completa de exames médicos</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Hoje
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <ExamMetrics metrics={examMetrics} />

      {/* Conteúdo Principal */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full lg:w-[500px] grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Atividade Recente */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Atividade Recente
                </CardTitle>
                <CardDescription>
                  Últimos exames realizados hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FlaskConical className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{exam.patient}</p>
                          <p className="text-sm text-gray-600">{exam.exam}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">{exam.time}</span>
                        <Badge className={getStatusBadge(exam.status, exam.type)}>
                          {exam.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Estatísticas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxa de Conclusão</span>
                    <span className="text-2xl font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tempo Médio</span>
                    <span className="text-2xl font-bold text-blue-600">45min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfação</span>
                    <span className="text-2xl font-bold text-purple-600">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">4 exames atrasados</p>
                      <p className="text-xs text-yellow-700">Necessitam atenção imediata</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Verificar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Próximo exame em 15min</p>
                      <p className="text-xs text-blue-700">Hemograma - Maria Silva</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Preparar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar exames..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="nao_pago">Não Pago</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    Tabela
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Exames Pendentes */}
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  Erro ao carregar exames pendentes
                </div>
              </CardContent>
            </Card>
          ) : pendingExams?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  Nenhum exame pendente encontrado
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingExams?.map((exam: ExamsType) => (
                    <ExamCard
                      key={exam.id}
                      exam={exam}
                      onEdit={handleExamEdit}
                      onView={handleExamView}
                      onStart={handleExamStart}
                    />
                  ))}
                </div>
              ) : (
                <ExamTable
                  exams={pendingExams || []}
                  onEdit={handleExamEdit}
                  onView={handleExamView}
                  onStart={handleExamStart}
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Histórico de Exames
              </CardTitle>
              <CardDescription>
                Consulte o histórico completo de exames realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Funcionalidade de histórico será implementada em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Análises e Relatórios
              </CardTitle>
              <CardDescription>
                Visualize estatísticas detalhadas sobre os exames
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Funcionalidade de análises será implementada em breve
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}