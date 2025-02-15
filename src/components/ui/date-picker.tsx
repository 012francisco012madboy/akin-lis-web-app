"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultDate?: DateRange | Date | undefined;
  dateFormat?: string;
  placeholderText?: string;
  enableRange?: boolean; // Novo controle para habilitar/desabilitar range
  onDateChange?: (date: DateRange | Date | undefined) => void;
  enableDateFilter?: boolean; // Novo controle para habilitar/desabilitar filtragem de data
  setEnableDateFilter?: (enable: boolean) => void; // Adicione esta linha para passar a função de ativação de filtragem
}

export function DatePickerWithRange({
  className,
  defaultDate = {
    from: new Date(),
    to: new Date(),
  },
  dateFormat = "LLL dd, y",
  placeholderText = "Selecione uma data",
  enableRange = true, // Ativo por padrão
  onDateChange,
  enableDateFilter = true, // Ativo por padrão
  setEnableDateFilter, // Adicione esta linha para passar a função de ativação de filtragem
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | Date | undefined>(
    enableRange ? defaultDate : (defaultDate as DateRange)?.from
  );

  const handleDateChange = (
    selectedDate: DateRange | Date | undefined
  ) => {
    setDate(selectedDate);
    onDateChange?.(selectedDate);
    if (selectedDate && setEnableDateFilter) {
      setEnableDateFilter(true); // Ativa a filtragem de data ao selecionar uma data
    }
  };

  const clearDates = () => {
    setDate(enableRange ? { from: undefined, to: undefined } : undefined);
    onDateChange?.(enableRange ? { from: undefined, to: undefined } : undefined);
    if (setEnableDateFilter) {
      setEnableDateFilter(false); // Desativa a filtragem de data ao limpar as datas
    }
  };

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-picker-trigger"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            aria-label="Abrir seletor de data"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {enableDateFilter ? (
              enableRange ? (
                date && (date as DateRange)?.from ? (
                  (date as DateRange)?.to ? (
                    <>
                      {format((date as DateRange).from!, dateFormat)} -{" "}
                      {format((date as DateRange).to!, dateFormat)}
                    </>
                  ) : (
                    format((date as DateRange).from!, dateFormat)
                  )
                ) : (
                  <span>{placeholderText}</span>
                )
              ) : date ? (
                format(date as Date, dateFormat)
              ) : (
                <span>{placeholderText}</span>
              )
            ) : (
              <span>{placeholderText}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          aria-label="Seletor de intervalo de datas"
        >
          {enableDateFilter && (
            enableRange ? (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={(date as DateRange)?.from}
                selected={date as DateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            ) : (
              <Calendar
                initialFocus
                mode="single"
                defaultMonth={date as Date}
                selected={date as Date}
                onSelect={handleDateChange}
                numberOfMonths={1}
                className="w-full"
              />
            )
          )}
          <Button variant="outline" className="w-full mt-2" onClick={clearDates}>
            Limpar Datas
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

