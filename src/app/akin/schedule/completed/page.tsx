"use client";

import CardScheduleContainer from "../CardScheduleContainer";
import { _axios } from "@/lib/axios";
import { ___showErrorToastNotification } from "@/lib/sonner";
import { useQuery } from "@tanstack/react-query";
import { groupSchedulesByPatient } from "./_groupSchedulesByPatient";
import { sortExamsByDate } from "./_sortExamsByDate";

export default function Completed() {
  const { data, isPending } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      return await _axios.get<ScheduleType[]>("/schedulings/concluded")
    },
  })
  if (isPending) {
    return (
      <div className="h-screen px-6 mx-auto">
        <div className="flex items-center justify-center h-full">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      </div>
    );
  }
  const groupedSchedules = groupSchedulesByPatient(data?.data || []);
  const groupedSchedulesArray = Object.values(groupedSchedules).map(schedule => ({
    ...schedule,
    Exame: sortExamsByDate(schedule.Exame)
  }));

  return (
    <div className="h-max w-full px-6 pb-6">
      <CardScheduleContainer
        isLoading={isPending}
        title="Agendamentos Concluídos"
        schedule={groupedSchedulesArray}
      />
    </div>
  );
}