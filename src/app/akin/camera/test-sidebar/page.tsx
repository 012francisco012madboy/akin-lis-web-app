import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, GraduationCap, Mail, Clock } from "lucide-react"
import { SidebarLayout } from "./components/sidebar-layout"

export default function Page() {
  return (
    <SidebarLayout>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao Portal do IPIL</h1>
          <p className="text-muted-foreground">
            Acesse todas as funcionalidades do sistema acadêmico através do menu lateral.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disciplinas Ativas</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 em relação ao semestre anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Avaliações</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">5 não lidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência Média</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Acima da média exigida</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Suas últimas interações no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Nova nota disponível</p>
                  <p className="text-xs text-muted-foreground">Matemática Aplicada - há 2 horas</p>
                </div>
                <Badge variant="secondary">Nova</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Horário atualizado</p>
                  <p className="text-xs text-muted-foreground">Alteração na sala 204 - ontem</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Convocatória respondida</p>
                  <p className="text-xs text-muted-foreground">Projeto Final - há 3 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Datas importantes para não esquecer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Prova de Física</p>
                  <p className="text-xs text-muted-foreground">Sala 301</p>
                </div>
                <Badge variant="destructive">Amanhã</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Entrega do Projeto</p>
                  <p className="text-xs text-muted-foreground">Programação Web</p>
                </div>
                <Badge variant="outline">15 Dez</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reunião de Orientação</p>
                  <p className="text-xs text-muted-foreground">Prof. Silva</p>
                </div>
                <Badge variant="outline">18 Dez</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  )
}
