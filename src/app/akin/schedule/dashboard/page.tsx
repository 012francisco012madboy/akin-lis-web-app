// app/(dashboard)/schedule/page.tsx

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function PatientScheduleDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Resumo dos exames */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exames Agendados</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Nesta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Aguardando realização</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de exames */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Exames</CardTitle>
          <CardDescription>Agendamentos mais próximos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              paciente: "Joana Martins",
              exame: "Raio-X de Tórax",
              local: "Sala 2",
              data: "Hoje - 14:00",
              status: "Pendente",
              variant: "secondary"
            },
            {
              paciente: "Carlos Menezes",
              exame: "Ultrassom Abdominal",
              local: "Sala 1",
              data: "Hoje - 16:30",
              status: "Confirmado",
              variant: "default"
            },
            {
              paciente: "Fernanda Lima",
              exame: "Exame de Sangue",
              local: "Laboratório 3",
              data: "03 Jul - 09:00",
              status: "Pendente",
              variant: "secondary"
            },
            {
              paciente: "Rafael Torres",
              exame: "Ressonância Magnética",
              local: "Sala 5",
              data: "05 Jul - 11:00",
              status: "Cancelado",
              variant: "destructive"
            }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{item.exame}</p>
                <p className="text-xs text-muted-foreground">
                  {item.paciente} — {item.local} — {item.data}
                </p>
              </div>
              <Badge variant={item.variant as any}>{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
