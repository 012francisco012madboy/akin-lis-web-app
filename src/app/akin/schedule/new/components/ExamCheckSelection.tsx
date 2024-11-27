import { IExamProps } from "../../types";
import { CheckBoxExam } from "./CheckBoxExam";

export function ExamSelection({ exams, isLoading, isSaving }: { exams: IExamProps[]; isLoading: boolean; isSaving: boolean }) {
  return (
    <div className="h-[29rem] w-[16rem] flex flex-col rounded-lg border bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Cabeçalho */}
      <div className="p-4 border-b">
        <h1 className="font-semibold text-xl text-gray-800">Exames Disponíveis</h1>
      </div>

      {/* Conteúdo */}    
      <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : exams.length > 0 ? (
          exams.map((exam) => (
            <CheckBoxExam
              key={exam.id}
              id={exam.id}
              nome={exam.nome}
              status={exam.status}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">Nenhum exame disponível</div>
        )}
      </div>

      {/* Botão de ação */}
      <div className="p-4 border-t">
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${
            isSaving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition-all duration-200`}
          disabled={isSaving}
        >
          {isSaving ? "Marcando..." : "Agendar"}
        </button>
      </div>
    </div>
  );
}
