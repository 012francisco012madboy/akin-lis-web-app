import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarDays, Clock, FileText, ArrowRight } from "lucide-react";
import { ResponseData } from "../../../[id]/next-exam/types";

interface NextExamsCardProps {
  patientId: string;
  nextExams?: ResponseData;
}

export function NextExamsCard({ patientId, nextExams }: NextExamsCardProps) {
  const hasExams = nextExams?.data && nextExams.data.length > 0;

  return (
    <Card className="w-full shadow-md border bg-gradient-to-br from-green-50/50 to-emerald-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Próximos Exames
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Exames agendados para este paciente
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasExams ? (
          <div className="space-y-3">
            {nextExams.data.slice(0, 2).map((exam, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-md transition-all duration-200 hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {exam.Tipo_Exame.nome}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {new Date(exam.data_agendamento).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{exam.hora_agendamento}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    Agendado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum exame agendado</p>
            <p className="text-sm text-gray-400 mt-1">
              Não há exames próximos para este paciente
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`${patientId}/next-exam`} className="w-full">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
            size="lg"
          >
            <span>Ver todos os exames</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
