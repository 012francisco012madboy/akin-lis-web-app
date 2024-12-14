import { Exam } from "../../exam-history/useExamHookData";


const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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

export const ExamCard: React.FC<Exam> = ({ data }) => (
  data.map((exame) => (
    <div key={exame.id} className="border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{exame.exame.nome}</h3>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Descrição: <span className="font-medium">{exame.exame.descricao}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Data do Agendamento:{" "}
        <span className="font-medium">{exame.Agendamento.data_agendamento}</span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Hora: <span className="font-medium">{exame.Agendamento.hora_agendamento}</span>
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
            exame.Agendamento.status_pagamento
          )}`}
        >
          {exame.Agendamento.status_pagamento}
        </span>
      </p>
      <p className="text-sm text-gray-600 font-bold mb-1">
        Valor Pago:{" "}
        <span className="font-medium">
          {exame.Agendamento.status_pagamento}
        </span>
      </p>
    </div>
  ))

);