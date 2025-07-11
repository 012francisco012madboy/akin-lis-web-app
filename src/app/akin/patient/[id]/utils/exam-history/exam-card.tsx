import ReactShareButton from "@/app/akin/camera/share/reactShare";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, User, DollarSign, FileText, Activity, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExamData {
  id: number;
  data_agendamento: string;
  hora_agendamento: string;
  status: string;
  status_pagamento: string;
  Tipo_Exame: {
    nome: string;
    descricao: string;
    preco: number;
  };
  Agendamento: {
    id_unidade_de_saude: number;
    id_tecnico_alocado: string | null;
  };
}

const getStatusColor = (status: string): string => {
  switch (String(status).toLowerCase()) {
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "concluído":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelado":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getPaymentStatusColor = (status: string): string => {
  switch (String(status).toLowerCase()) {
    case "pago":
      return "bg-green-100 text-green-800 border-green-300";
    case "pendente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "cancelado":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return dateString;
  }
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const ExamCard = ({ data }: { data: ExamData[] }) => {
  return (
    <>
      {data.map((exame) => (
        <Card key={exame.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {exame.Tipo_Exame.nome}
              </CardTitle>
              <Badge className={getStatusColor(exame.status)}>
                {exame.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Description */}
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Descrição</p>
                <p className="text-sm text-gray-600">{exame.Tipo_Exame.descricao}</p>
              </div>
            </div>

            <Separator />

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Data</p>
                  <p className="text-sm text-gray-600">{formatDate(exame.data_agendamento)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Hora</p>
                  <p className="text-sm text-gray-600">{exame.hora_agendamento}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location and Technician */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Unidade de Saúde</p>
                  <p className="text-sm text-gray-600">ID: {exame.Agendamento.id_unidade_de_saude}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Técnico Alocado</p>
                  <p className="text-sm text-gray-600">
                    {exame.Agendamento.id_tecnico_alocado || "Não alocado"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Pagamento</span>
                </div>
                <Badge className={getPaymentStatusColor(exame.status_pagamento)}>
                  {exame.status_pagamento}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valor:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(exame.Tipo_Exame.preco)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Action Button */}
            <div className="pt-2">
              <ReactShareButton>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Laudo
                </Button>
              </ReactShareButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};