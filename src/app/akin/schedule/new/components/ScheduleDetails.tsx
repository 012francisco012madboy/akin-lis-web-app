"use client";
import { Combobox } from "@/components/combobox/comboboxExam";
import { Skeleton } from "@/components/ui/skeleton";
import { IExamProps } from "../../types";
import { _axios } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Calendar } from "primereact/calendar";
import TimePicker from "@/components/ui/timepicker";

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
        // Ajusta para horário local
        const localDate = new Date(dateValue.getTime() - dateValue.getTimezoneOffset() * 60 * 1000);
        formattedValue = localDate.toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
        // console.log("Data formatada:", formattedValue);
      } else {
        // console.error("Valor inválido para data:", value);
      }
    } else if (key === "time") {
      const timeValue = value instanceof Date ? value : new Date(`1970-01-01T${value}`);

      if (!isNaN(timeValue.getTime())) {
        formattedValue = timeValue.toTimeString().split(" ")[0].slice(0, 5); // Formato 'HH:mm'
        // console.log("Hora formatada:", formattedValue);
      } else {
        // console.error("Valor inválido para hora:", value);
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
              id="buttondisplay"
              className="w-full h-10 px-4 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-0 focus:border-none focus-visible:ring-0"
              onChange={(date) => handleScheduleChange(index, "date", date)}
              showIcon
              dateFormat="yy/m/d"
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
      <Button type="button" onClick={handleAddSchedule} className="bg-akin-yellow-light/80 text-black shadow-md  hover:bg-akin-yellow-light hover:scale-90">
        <Plus />
        Adicionar
      </Button>
    </div>
  );
}