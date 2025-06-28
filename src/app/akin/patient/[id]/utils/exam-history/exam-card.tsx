import ReactShareButton from "@/app/akin/camera/share/reactShare";
import { Button } from "@/components/ui/button";

const getStatusColor = (status: string) => {
  switch (String(status).toLowerCase()) {
    case "pendente":
      return "yellow-500";
    case "concluído":
      return "green-500";
    case "cancelado":
      return "red-500";
    default:
      return "gray-500";
  }
};
// : React.FC<Exam[]>
export const ExamCard = ({ data }: { data: any[] }) => (
  data.map((exame) => (
    <div key={exame.id} className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{exame.Tipo_Exame.nome}</h3>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Descrição: <span className="font-medium">{exame.Tipo_Exame.descricao}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Data do Agendamento:{" "}
        <span className="font-medium">{exame.data_agendamento}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Hora: <span className="font-medium">{exame.hora_agendamento}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Unidade de Saúde:{" "}
        <span className="font-medium">{exame.Agendamento.id_unidade_de_saude}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Técnico Alocado:{" "}
        <span className="font-medium">
          {exame.Agendamento.id_tecnico_alocado || "Não alocado"}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Status do Exame:{" "}
        <span className={`font-medium text-${getStatusColor(exame.status)}`}>
          {exame.status}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Status do Pagamento:{" "}
        <span
          className={`font-medium text-${getStatusColor(
            exame.status_pagamento
          )}`}
        >
          {exame.status_pagamento}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Valor a ser pago:{" "}
        <span className="font-medium">
          {exame.Tipo_Exame.preco}
        </span>
      </p>

      <ReactShareButton>
        <Button className="h-8 w-full mt-5 bg-akin-turquoise hover:bg-akin-turquoise/80">
          Enviar laudo
        </Button>
      </ReactShareButton>
    </div>
  ))
);