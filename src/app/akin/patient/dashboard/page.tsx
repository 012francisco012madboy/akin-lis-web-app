import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  Clock
} from "lucide-react";

export default function PatientDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">

      {/* Indicadores principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">134</div>
            <p className="text-xs text-muted-foreground">+12 nesta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">Inclui 5 urgências</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">6</div>
            <p className="text-xs text-muted-foreground">Pacientes com risco elevado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Espera</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 min</div>
            <p className="text-xs text-muted-foreground">Dentro do limite ideal</p>
          </CardContent>
        </Card>
      </div>

      {/* Seções de atividades */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atendimentos Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas na clínica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Stethoscope className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Consulta finalizada</p>
                <p className="text-xs text-muted-foreground">João da Silva - há 1 hora</p>
              </div>
              <Badge variant="secondary">Novo</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Alerta de pressão alta</p>
                <p className="text-xs text-muted-foreground">Maria Lopes - há 3 horas</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <ClipboardList className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Novo exame solicitado</p>
                <p className="text-xs text-muted-foreground">Carlos Alberto - ontem</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Agenda dos próximos dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Consulta de retorno</p>
                <p className="text-xs text-muted-foreground">Ana Beatriz</p>
              </div>
              <Badge variant="destructive">Hoje</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Exame de sangue</p>
                <p className="text-xs text-muted-foreground">Laboratório Central</p>
              </div>
              <Badge variant="outline">3 Jul</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avaliação cardiológica</p>
                <p className="text-xs text-muted-foreground">Dra. Cristina</p>
              </div>
              <Badge variant="outline">5 Jul</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
