"use client";

import { useEffect, useState } from "react";
import CardScheduleContainer from "../CardScheduleContainer";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";
import { useAuthStore } from "@/utils/zustand-store/authStore";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../../profile/page";
import { redirect } from "next/navigation";

export default function Request() {
  const [requestSchedule, setRequestSchedule] = useState<ScheduleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { data } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      return await _axios.get<UserData>(`/users/${user?.id}`);
    },
  });

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
   
  if (data?.data.tipo === "CHEFE" || data?.data.tipo === "TECNICO") {
    return redirect("/akin/schedule/completed");
  }

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