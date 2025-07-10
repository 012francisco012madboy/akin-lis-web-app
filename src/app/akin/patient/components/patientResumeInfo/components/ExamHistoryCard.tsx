import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Calendar, Clock, Activity, ArrowRight } from "lucide-react";
import { Exam } from "../../../[id]/exam-history/useExamHookData";

interface ExamHistoryCardProps {
  patientId: string;
  examHistory?: Exam;
}

export function ExamHistoryCard({ patientId, examHistory }: ExamHistoryCardProps) {
  const hasExams = examHistory?.data && examHistory.data.length > 0;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'concluido':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="w-full shadow-md border bg-gradient-to-br  to-pink-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Histórico de Exames
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Exames anteriores realizados
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasExams ? (
          <div className="space-y-3">
            {examHistory.data.slice(0, 2).map((exam, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-md transition-all duration-200 hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {exam.Tipo_Exame.nome}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(exam.data_agendamento).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Realizado</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className={getStatusColor(exam.Tipo_Exame.status)}
                  >
                    {exam.Tipo_Exame.status || 'Concluído'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum exame realizado</p>
            <p className="text-sm text-gray-400 mt-1">
              Não há histórico de exames para este paciente
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`${patientId}/exam-history`} className="w-full">
          <Button
            className="w-full bg-akin-turquoise hover:bg-akin-turquoise text-white shadow-md transition-all duration-200 hover:shadow-lg"
            size="lg"
          >
            <span>Ver histórico completo</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
