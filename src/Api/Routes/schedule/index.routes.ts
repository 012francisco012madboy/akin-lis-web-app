import { _axios } from "@/Api/axios.config";
import { ___showErrorToastNotification, ___showSuccessToastNotification } from "@/lib/sonner";

class ScheduleRoutes {

  async getPendingSchedules() {
    try {
      const response = await _axios.get<ScheduleType[]>("/schedulings/pending");
      return response.data;
    } catch (error) {
      ___showErrorToastNotification({
        message: "Erro inesperado ocorreu ao buscar os dados. Atualize a página ou contate o suporte.",
      });
      throw error;
    }
  }

  async acceptSchedule(scheduleId: number) {
    try {
      const response = await _axios.patch(`/schedulings/${scheduleId}`, { status: "CONCLUIDO" });
      ___showSuccessToastNotification({
        message: "Agendamento aceito com sucesso!",
      });
      return response.data;
    } catch (error) {
      ___showErrorToastNotification({
        message: "Erro ao aceitar agendamento. Tente novamente.",
      });
      throw error;
    }
  }

  async rejectSchedule(scheduleId: number) {
    try {
      const response = await _axios.patch(`/schedulings/${scheduleId}`, { status: "CANCELADO" });
      ___showSuccessToastNotification({
        message: "Agendamento recusado com sucesso!",
      });
      return response.data;
    } catch (error) {
      ___showErrorToastNotification({
        message: "Erro ao recusar agendamento. Tente novamente.",
      });
      throw error;
    }
  }
}

export const scheduleRoutes = new ScheduleRoutes();