import { useState, useMemo } from "react";
import { ScheduleFilters } from "@/components/schedule/ScheduleFilters";

export function useScheduleFilters(schedules: ScheduleType[]) {
  const [filters, setFilters] = useState<ScheduleFilters>({
    searchQuery: "",
  });

  const filteredSchedules = useMemo(() => {
    if (!schedules) return [];

    return schedules.filter((schedule) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const patient = schedule.Paciente;
        const matchesName = patient?.nome_completo?.toLowerCase().includes(query);
        const matchesBI = patient?.numero_identificacao?.toLowerCase().includes(query);
        const matchesPhone = patient?.contacto_telefonico?.toLowerCase().includes(query);

        if (!matchesName && !matchesBI && !matchesPhone) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom && schedule.Exame && schedule.Exame.length > 0) {
        const hasDateInRange = schedule.Exame.some(exam => {
          const examDate = new Date(exam.data_agendamento);
          return examDate >= filters.dateFrom!;
        });
        if (!hasDateInRange) {
          return false;
        }
      }

      if (filters.dateTo && schedule.Exame && schedule.Exame.length > 0) {
        const hasDateInRange = schedule.Exame.some(exam => {
          const examDate = new Date(exam.data_agendamento);
          return examDate <= filters.dateTo!;
        });
        if (!hasDateInRange) {
          return false;
        }
      }

      // Gender filter
      if (filters.gender) {
        const genderId = parseInt(filters.gender);
        if (schedule.Paciente?.id_sexo !== genderId) {
          return false;
        }
      }

      // Exam type filter
      if (filters.examType) {
        const hasExamType = schedule.Exame?.some(exam =>
          exam.Tipo_Exame?.nome?.toLowerCase().includes(filters.examType!.toLowerCase())
        );
        if (!hasExamType) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange) {
        const totalPrice = schedule.Exame?.reduce((total, exam) => total + (exam.Tipo_Exame?.preco || 0), 0) || 0;

        if (filters.priceRange.min && totalPrice < filters.priceRange.min) {
          return false;
        }

        if (filters.priceRange.max && totalPrice > filters.priceRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [schedules, filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleFilterChange = (newFilters: ScheduleFilters) => {
    setFilters(newFilters);
  };

  return {
    filteredSchedules,
    filters,
    handleSearch,
    handleFilterChange,
  };
}
