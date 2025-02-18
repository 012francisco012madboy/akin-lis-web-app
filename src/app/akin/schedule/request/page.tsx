"use client";

import { useEffect, useState } from "react";
import CardScheduleContainer from "../CardScheduleContainer";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";
export default function Request() {
  const [requestSchedule, setRequestSchedule] = useState<ScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await _axios.get("/schedulings/pending");
        setRequestSchedule(response.data);
      } catch (error) {
        ___showErrorToastNotification({
          message: "Erro inesperado ocorreu ao buscar os dados. Atualize a página ou contate o suporte.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);
   
  return (
    <div className="h-screen px-6 mx-auto">
      <CardScheduleContainer
        isLoading={isLoading}
        title="Agendamentos em Andamento"
        schedule={requestSchedule}
      />
    </div>
  );
}