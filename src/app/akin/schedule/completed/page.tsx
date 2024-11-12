"use client";

import { useEffect, useState } from "react";
import CardScheduleContainer from "../CardScheduleContainer";
import { ___api } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";

export default function Completed() {
  const [completedSchedules, setCompletedSchedules] = useState<ScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = (message: string) => {
    ___showErrorToastNotification({
      message: message || "Erro inesperado ao buscar dados. Tente novamente ou contate o suporte."
    });
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchCompletedSchedules = async () => {
      try {
        const response = await ___api.get("/schedulings/concluded");
        setCompletedSchedules(response.data);
      } catch (error) {
        handleError("Erro ao buscar agendamentos concluídos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedSchedules();
  }, []);

  return (
    <div className="h-screen px-6 mx-auto">
      <CardScheduleContainer isLoading={isLoading} title="Agendamentos Concluídos" schedule={completedSchedules} />
    </div>
  );
}
