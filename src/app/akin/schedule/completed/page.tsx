"use client";

import CardScheduleContainer from "../CardScheduleContainer";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";
import { useQuery } from "@tanstack/react-query";
import { groupSchedulesByPatient } from "./groupSchedulesByPatient";

function sortExamsByDate(exams: ScheduleType["Exame"]): ScheduleType["Exame"] {
  return exams.sort((a, b) => new Date(a.data_agendamento).getTime() - new Date(b.data_agendamento).getTime());
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
  const groupedSchedulesArray = Object.values(groupedSchedules).map(schedule => ({
    ...schedule,
    Exame: sortExamsByDate(schedule.Exame)
  }));

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
