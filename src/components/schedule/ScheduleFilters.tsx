"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, Filter, CalendarIcon, X, Users, Clock, DollarSign, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ScheduleFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ScheduleFilters) => void;
  totalSchedules: number;
  filteredCount: number;
}

export interface ScheduleFilters {
  searchQuery: string;
  dateFrom?: Date;
  dateTo?: Date;
  examType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  gender?: string;
}

export function ScheduleFilters({
  onSearch,
  onFilterChange,
  totalSchedules,
  filteredCount
}: ScheduleFiltersProps) {
  const [filters, setFilters] = useState<ScheduleFilters>({
    searchQuery: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, searchQuery: value };
    setFilters(newFilters);
    onSearch(value);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof ScheduleFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ScheduleFilters = { searchQuery: "" };
    setFilters(clearedFilters);
    onSearch("");
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.dateFrom || filters.dateTo || filters.examType ||
      filters.priceRange || filters.gender || filters.searchQuery;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.examType) count++;
    if (filters.priceRange) count++;
    if (filters.gender) count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome do paciente, BI ou contacto..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {hasActiveFilters() && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                Mostrando {filteredCount} de {totalSchedules} agendamentos
              </span>
            </div>
            {filters.searchQuery && (
              <Badge variant="outline">
                Busca: &quot;{filters.searchQuery}&quot;
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
