import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MapPin,
  IdCard
} from "lucide-react";
import { Chart } from "primereact/chart";

interface TechnicianDialogProps {
  technician: ITeamManagement;
  isOpen: boolean;
  onClose: () => void;
}

const TechnicianDialog: React.FC<TechnicianDialogProps> = ({ technician, isOpen, onClose }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const performanceData = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Exames Realizados",
          data: [45, 52, 48, 61, 55, 58],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#374151',
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

    setChartData(performanceData);
    setChartOptions(options);
  }, []);

  const getStatusBadge = (status: string) => {
    return status === "ATIVO"
      ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
      : <Badge variant="secondary">
        <AlertCircle className="h-3 w-3 mr-1" />
        Inativo
      </Badge>;
  };

  const getTurnoBadge = (turno: string) => {
    const colors = {
      "Manhã": "bg-blue-100 text-blue-800",
      "Tarde": "bg-orange-100 text-orange-800",
      "Noite": "bg-purple-100 text-purple-800"
    };
    return <Badge className={colors[turno as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{turno}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                {technician.nome_completo?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{technician.nome_completo}</h2>
              <p className="text-gray-600">{technician.cargo}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(technician.status || "INATIVO")}
                {getTurnoBadge(technician.turno || "Manhã")}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{technician.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{technician.contacto_telefonico}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="font-medium">{technician.data_nascimento}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IdCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Número de Identificação</p>
                      <p className="font-medium">{technician.numero_identificacao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações Profissionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    Informações Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Especialidade</p>
                    <p className="font-medium">{technician.especialidade || "Geral"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Turno de Trabalho</p>
                    <p className="font-medium">{technician.turno || "Manhã"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Usuário</p>
                    <p className="font-medium">{technician.tipo}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Último Acesso</p>
                      <p className="font-medium">{technician.ultimo_acesso || "Não disponível"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600">{technician.exames_realizados || 0}</div>
                  <p className="text-sm text-gray-600 mt-1">Exames Realizados</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600">{technician.eficiencia || 0}%</div>
                  <p className="text-sm text-gray-600 mt-1">Eficiência</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600">4.8</div>
                  <p className="text-sm text-gray-600 mt-1">Avaliação</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Desempenho dos Últimos 6 Meses
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
                  <CardTitle>Métricas de Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Precisão</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tempo Médio</span>
                    <span className="font-medium">8.2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de Retrabalho</span>
                    <span className="font-medium text-green-600">1.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pontuação de Qualidade</span>
                    <span className="font-medium">9.1/10</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Materiais Utilizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reagentes</span>
                      <span className="font-medium">245 unidades</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tubos de Ensaio</span>
                      <span className="font-medium">189 unidades</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pipetas</span>
                      <span className="font-medium">67 unidades</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lâminas</span>
                      <span className="font-medium">156 unidades</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "08:30", activity: "Realizou exame de hemograma completo", patient: "Maria Silva" },
                    { time: "09:15", activity: "Processou amostra de urina", patient: "João Santos" },
                    { time: "10:00", activity: "Executou teste de glicemia", patient: "Ana Costa" },
                    { time: "10:45", activity: "Preparou lâmina para microscopia", patient: "Carlos Lima" },
                    { time: "11:30", activity: "Realizou cultura bacteriana", patient: "Paula André" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="text-sm text-gray-500 font-mono">{item.time}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                        <p className="text-xs text-gray-500">Paciente: {item.patient}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Editar Técnico
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianDialog;