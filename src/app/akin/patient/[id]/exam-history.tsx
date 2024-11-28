import { ___api } from "@/lib/axios";
import { _formatPrice } from "@/utils/mask/currency";

interface IExamsHistory {
  patientId: string;
}

export default async function ExamsHistory({ patientId }: IExamsHistory) {
  try {
    const response = await ___api.get<ExamsType[]>(`exams/pacient/${patientId}`);
    const exames = response.data;

    return (
      <div className="flex flex-col p-4">
        {exames.length > 0 ? (
          <div className="flex flex-col gap-4">
            {exames.map((exam) => (
              <EachExam key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Nenhum Exame encontrado</p>
        )}
      </div>
    );
  } catch (error) {
    console.error(`Erro ao buscar exames do paciente ${patientId}:`, error);
    return <p className="text-center text-red-500">Erro ao buscar exames.</p>;
  }
}

function EachExam({ exam }: { exam: ExamsType }) {
  return (
    <div className="flex justify-between p-2 border-b rounded-lg mb-1">
      <div>
        <p className="font-bold text-lg">
          {exam.Tipo_Exame.nome} - {_formatPrice(exam.preco)}
        </p>
        <p>Detalhes: {exam.Tipo_Exame.descricao}</p>
        <p>ID do Agendamento: {exam.id_agendamento}</p>
      </div>
      <p
        data-active={exam.status === "ATIVO"}
        className={`lowercase size-6 rounded-full ${exam.status === "ATIVO" ? "bg-green-300" : "bg-red-300"}`}
        title={exam.status}
      ></p>
    </div>
  );
}
