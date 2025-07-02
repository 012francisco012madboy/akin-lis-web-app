"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isWithinInterval, parseISO } from "date-fns";
import { CalendarIcon, FlaskConical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";


type LabExam = {
  id: string;
  patientName: string;
  examType: string;
  scheduledAt: string;
};


const mockExams: LabExam[] = [
  { id: "1", patientName: "Ana Silva", examType: "Covid-19", scheduledAt: "2025-06-25T09:00:00Z" },
  { id: "2", patientName: "João Pedro", examType: "HIV", scheduledAt: "2025-06-25T10:00:00Z" },
  { id: "3", patientName: "Maria José", examType: "Covid-19", scheduledAt: "2025-06-26T11:00:00Z" },
  { id: "4", patientName: "Carlos Miguel", examType: "HIV", scheduledAt: "2025-06-27T11:30:00Z" },
  { id: "5", patientName: "Paula André", examType: "Malária", scheduledAt: "2025-06-28T12:00:00Z" },
];

const uniqueExamTypes = Array.from(new Set(mockExams.map((e) => e.examType)));

export default function LabExamsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const filteredExams = mockExams.filter((exam) => {
    const matchesType = selectedType ? exam.examType === selectedType : true;
    const matchesSearch = search
      ? exam.patientName.toLowerCase().includes(search.toLowerCase())
      : true;
    const examDate = parseISO(exam.scheduledAt);
    const matchesDate =
      dateRange.from && dateRange.to
        ? isWithinInterval(examDate, { start: dateRange.from, end: dateRange.to })
        : true;
    return matchesType && matchesSearch && matchesDate;
  });

  const grouped = filteredExams.reduce<Record<string, LabExam[]>>((acc, exam) => {
    if (!acc[exam.examType]) acc[exam.examType] = [];
    acc[exam.examType].push(exam);
    return acc;
  }, {});

  return (
    <div className="h-full mb-3 p-0 space-y-6 ">

      {/* Filtros */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <Input
            placeholder="Buscar por nome do paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-1/3"
          />

          <Select
            onValueChange={(value) => setSelectedType(value === "all" ? undefined : value)}
            value={selectedType ?? "all"}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Tipo de exame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueExamTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full lg:w-64 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  "Selecionar período"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                //@ts-ignore
                selected={dateRange}
                //@ts-ignore
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            className="text-sm text-blue-600 hover:underline ml-auto"
            onClick={() => {
              setSearch("");
              setSelectedType(undefined);
              setDateRange({ from: null, to: null });
            }}
          >
            Limpar filtros
          </Button>
        </div>
      </Card>

      {/* Lista de exames agrupados */}
      <ScrollArea className="h-[calc(100vh-100px)] pr-2 mt-4">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-muted-foreground text-center mt-10">Nenhum exame encontrado.</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([examType, exams]) => (
              <Card key={examType} className="p-4 shadow-md border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="text-blue-600 w-5 h-5" />
                  <h2 className="text-xl font-semibold">{examType}</h2>
                </div>
                <Separator className="mb-4" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exams.map((exam) => (
                    <Card
                      key={exam.id}
                      className="border border-muted shadow-sm hover:shadow-md transition rounded-lg"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">{exam.patientName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Agendado para:</p>
                        <p className="text-base font-medium">
                          {format(parseISO(exam.scheduledAt), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}