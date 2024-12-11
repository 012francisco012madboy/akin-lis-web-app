"use client";

import CardScheduleContainer from "../CardScheduleContainer";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";
import { useQuery } from "@tanstack/react-query";

function groupSchedulesByPatient(schedules: ScheduleType[]): Record<string, ScheduleType> {
  return schedules.reduce((acc, schedule) => {
    const patientId = schedule.Paciente.id;

    if (!acc[patientId]) {
      acc[patientId] = { ...schedule, Exame: [...schedule.Exame] };
    } else {
      acc[patientId].Exame.push(...schedule.Exame);
    }

    return acc;
  }, {} as Record<string, ScheduleType>);
}

export default function Completed() {
  const { data, isPending } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      return await _axios.get<ScheduleType[]>("/schedulings/concluded")
    }
  })
  

  if (isPending) {
    return <p>Processando...</p>
  }

  const groupedSchedules = groupSchedulesByPatient(data?.data || []);
  const groupedSchedulesArray = Object.values(groupedSchedules);

  return (
    <div className="h-max px-6 pb-6">
      <CardScheduleContainer
        isLoading={isPending}
        title="Agendamentos Concluídos"
        schedule={groupedSchedulesArray}
      />
    </div>
  );
}
