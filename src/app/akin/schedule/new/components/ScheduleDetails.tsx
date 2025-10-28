"use client";
import { Combobox } from "@/components/combobox/comboboxExam";
import { Skeleton } from "@/components/ui/skeleton";
import { _axios } from "@/Api/axios.config";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Calendar } from "primereact/calendar";
import TimePicker from "@/components/ui/timepicker";
import { IExamProps } from "@/module/types";

export function ScheduleDetails({
  isLoading,
  exams,
  schedules,
  onChange,
}: {
  isLoading: boolean;
  exams: IExamProps[];
  schedules: { exam: string; date: Date; time: string }[];
  onChange: (schedules: { exam: string; date: Date; time: string }[]) => void;
}) {

  const handleScheduleChange = (index: number, key: string, eventOrValue: any) => {
    const value = eventOrValue?.value || eventOrValue; // Extrai o campo 'value' se disponível
    let formattedValue = value;

    if (key === "date") {
      const dateValue = value instanceof Date ? value : new Date(value);

      if (!isNaN(dateValue.getTime())) {
        if (key === "date") {
          const dateValue = value instanceof Date ? value : new Date(value);
          if (!isNaN(dateValue.getTime())) {
            formattedValue = dateValue; // mantém como Date
          }
        }
      }
    } else if (key === "time") {
      const timeValue = value instanceof Date ? value : new Date(`1970-01-01T${value}`);

      if (!isNaN(timeValue.getTime())) {
        formattedValue = timeValue.toTimeString().split(" ")[0].slice(0, 5); // Formato 'HH:mm'
      }
    }

    // Atualiza os agendamentos com o valor formatado
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [key]: formattedValue };
    onChange(updatedSchedules);
  };

  const handleAddSchedule = () => {
    onChange([...schedules, { exam: "", date: new Date(), time: "" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <Skeleton className="w-full h-12 rounded-md" />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <div key={index} className="flex flex-col flex-wrap lg:flex-nowrap md:flex-row gap-4 justify-between">
          <div className="flex flex-col justify-between w-full ">
            <label className="font-bold block mb-2">Exames Disponíveis</label>
            <Combobox
              data={exams}
              displayKey="nome"
              onSelect={(exam) => handleScheduleChange(index, "exam", exam?.id)}
              placeholder="Selecionar exame"
              clearLabel="Limpar"
            />
          </div>
          <div className="card gap-3 w-full">
            <label htmlFor="buttondisplay" className="font-bold block mb-2">
              Data
            </label>
            <Calendar
              minDate={today}
              id="buttondisplay"
              value={schedule.date ? new Date(schedule.date) : null}
              className="w-full h-10 px-4 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-0 focus:border-none focus-visible:ring-0"
              onChange={(date) => handleScheduleChange(index, "date", date.value)}
              showIcon
              dateFormat="yy/mm/dd"
            />
          </div>

          <div className="flex items-end gap-0 w-full md:gap-2 flex-wrap md:flex-nowrap ">
            <div className="card gap-3 w-full">
              <label htmlFor="buttondisplay" className="font-bold block mb-2">
                Hora
              </label>
              <TimePicker
                onChange={(time) => handleScheduleChange(index, "time", time)}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleRemoveSchedule(index)}
            >
              <Trash2 size={45} className="text-red-600" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" onClick={handleAddSchedule} className=" py-2  px-4 bg-green-600 hover:bg-green-500  text-white shadow-md">
        <Plus />
        Adicionar
      </Button>
    </div>
  );
}