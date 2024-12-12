

export function groupSchedulesByPatient(schedules: ScheduleType[]): Record<string, ScheduleType> {
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