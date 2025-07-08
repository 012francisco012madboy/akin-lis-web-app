"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, TrendingUp, Users, UserCheck, UserX, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { Chart } from "primereact/chart";
import { useEffect } from "react";

const TEAM_STATS = {
  overview: [
    {
      id: 1,
      title: "Total de Técnicos",
      value: 15,
      change: "+2",
      changeType: "increase",
      icon: Users,
      description: "Técnicos ativos na equipe"
    },
    {
      id: 2,
      title: "Técnicos Ativos",
      value: 12,
      change: "-1",
      changeType: "decrease",
      icon: UserCheck,
      description: "Em atividade no momento"
    },
    {
      id: 3,
      title: "Produtividade Média",
      value: "87%",
      change: "+5%",
      changeType: "increase",
      icon: TrendingUp,
      description: "Eficiência da equipe"
    },
    {
      id: 4,
      title: "Exames Hoje",
      value: 234,
      change: "+18",
      changeType: "increase",
      icon: Activity,
      description: "Processados pela equipe"
    }
  ],
  teamPerformance: [
    { name: "Ana Silva", role: "Técnico Sênior", exams: 45, efficiency: 95, status: "active", avatar: "" },
    { name: "João Santos", role: "Técnico", exams: 38, efficiency: 89, status: "active", avatar: "" },
    { name: "Maria José", role: "Técnico", exams: 42, efficiency: 92, status: "active", avatar: "" },
    { name: "Carlos Lima", role: "Técnico Júnior", exams: 28, efficiency: 78, status: "inactive", avatar: "" },
    { name: "Paula André", role: "Técnico", exams: 35, efficiency: 85, status: "active", avatar: "" }
  ],
  workload: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [
      {
        label: "Exames Processados",
        data: [45, 52, 48, 61, 55, 32],
        backgroundColor: "rgba(16, 185, 129, 0.6)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        fill: true
      }
    ]
  },
  alerts: [
    { id: 1, type: "warning", message: "3 técnicos com sobrecarga de trabalho", priority: "medium" },
    { id: 2, type: "info", message: "Treinamento agendado para próxima semana", priority: "low" },
    { id: 3, type: "error", message: "João Santos ausente há 2 dias", priority: "high" }
  ]
};

export default function TeamManagementDashboard() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: TEAM_STATS.workload.labels,
      datasets: TEAM_STATS.workload.datasets
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#374151',
            usePointStyle: true,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#6B7280',
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#6B7280',
          },
          grid: {
            color: '#E5E7EB',
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  const getStatusBadge = (status: string) => {
    return status === "active"
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Equipe</h1>
          <p className="text-gray-600">Acompanhe o desempenho e produtividade da sua equipe</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Este Mês
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Adicionar Técnico
          </Button>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_STATS.overview.map((stat) => (
          <Card key={stat.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className={`inline-flex items-center ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {stat.change}
                </span>
                <span className="ml-2">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conteúdo em Abas */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full lg:w-[600px] grid-cols-3">
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="workload">Carga de Trabalho</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Desempenho da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TEAM_STATS.teamPerformance.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{member.exams}</p>
                        <p className="text-xs text-gray-500">Exames</p>
                      </div>
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Eficiência</span>
                          <span>{member.efficiency}%</span>
                        </div>
                      </div>
                      {getStatusBadge(member.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Carga de Trabalho Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Chart type="line" data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribuição de Turnos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Manhã (06:00 - 14:00)</span>
                    <span className="font-medium">8 técnicos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarde (14:00 - 22:00)</span>
                    <span className="font-medium">5 técnicos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Noite (22:00 - 06:00)</span>
                    <span className="font-medium">2 técnicos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tempo médio por exame</span>
                    <span className="font-medium">12 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de erro</span>
                    <span className="font-medium text-green-600">0.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Satisfação da equipe</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TEAM_STATS.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">Prioridade: {alert.priority}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Resolver
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
