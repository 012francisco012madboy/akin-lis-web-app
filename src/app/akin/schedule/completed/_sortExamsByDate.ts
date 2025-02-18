

export function sortExamsByDate(exams: ScheduleType["Exame"]): ScheduleType["Exame"] {
  return exams.sort((a, b) => new Date(a.data_agendamento).getTime() - new Date(b.data_agendamento).getTime());
}
