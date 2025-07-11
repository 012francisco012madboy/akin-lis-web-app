import { useQuery } from "@tanstack/react-query";
import { examRoutes } from "@/Api/Routes/Exam/index.route";

interface PendingExamsResponse {
  data: ExamsType[];
  status: number;
}

export const usePendingExams = () => {
  return useQuery<ExamsType[]>({
    queryKey: ["pending-exams"],
    queryFn: async () => {
      const response = await examRoutes.getPendingExams();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // Atualiza a cada 30 segundos
  });
};
