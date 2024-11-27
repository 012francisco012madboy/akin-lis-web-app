"use client";
import { Combobox } from "@/components/combobox";
import { Input } from "@/components/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { IExamProps } from "../../types";
import { ___api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Calendar } from "primereact/calendar";

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

  const handleScheduleChange = (index: number, key: string, value: any) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [key]: value };
    onChange(updatedSchedules);
  };

  const handleAddSchedule = () => {
    onChange([...schedules, { exam: "", date: new Date(), time: "" }]);
  };

  const handleRemoveSchedule = (index: number) => {
    onChange(schedules.filter((_, i) => i !== index));
  };

  // const handleSubmit = () => {
  //   console.log("Dados dos agendamentos:", schedules);
  // };

  if (isLoading) {
    return <Skeleton className="w-full h-12 rounded-md" />;
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule, index) => (
        <div key={index} className="flex flex-col flex-wrap md:flex-row gap-4 justify-between">
          <div className="flex flex-col justify-between">
            <label className="font-bold block mb-2">Exames Disponíveis</label>
            <Combobox
              data={exams}
              displayKey="nome"
              onSelect={(exam) => handleScheduleChange(index, "exam", exam)}
              placeholder="Selecionar exame"
              clearLabel="Limpar"
            />
          </div>
          {/* Input de data e hora */}
          <div className="card gap-3">
            <label htmlFor="buttondisplay" className="font-bold block mb-2">
              Data
            </label>
            <Calendar
              id="buttondisplay"
              className="flex-1 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-0 focus:border-none focus-visible:ring-0"
              onChange={(date) => handleScheduleChange(index, "date", date)}
              showIcon
              dateFormat="yy/m/d"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="card gap-3">
              <label htmlFor="buttondisplay" className="font-bold block mb-2">
                Hora
              </label>
              <Calendar
                id="buttondisplay"
                className="flex-1 text-black bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(time) => handleScheduleChange(index, "time", time)}
                showIcon
                timeOnly
                hourFormat="24"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={()=>handleRemoveSchedule(index)}
            >
              <Trash2 size={45} className="text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" onClick={handleAddSchedule}>
        Adicionar
      </Button>
      {/* Botão para exibir os dados */}
      {/* <Button type="button" onClick={handleSubmit}>
        Mostrar Dados no Console
      </Button> */}
    </div>
  );
}
