"use client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import CardSchedule from "./CardSchedule";

interface ICardScheduleContainer {
  schedule: ScheduleType[];
  title: string;
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 9;

export default function CardScheduleContainer({ schedule, title, isLoading }: ICardScheduleContainer) {
  const [filteredSchedule, setFilteredSchedule] = useState<ScheduleType[]>(schedule);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = filteredSchedule.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleSearch = (searchText: string) => {
    setIsSearching(!!searchText);

    if (schedule) {
      const filtered = schedule.filter((s) =>
        s.Paciente?.nome_completo?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSchedule(filtered);
    }
  };

  useEffect(() => {
    setFilteredSchedule(schedule);
  }, [schedule]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredSchedule.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <h1 className="text-3xl font-semibold">
          {title} <span className="text-sm text-gray-600">({schedule.length})</span>
        </h1>

        <div className="flex items-center space-x-4 mt-1">
          <Input
            className="w-full max-w-xs ring-0 focus:ring-0 focus-visible:ring-0"
            placeholder="Procurar por paciente"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Searching Result */}
      {isSearching && (
        <p className="text-sm text-gray-600 italic">
          Total de agendamentos encontrados: {filteredSchedule.length}
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div>
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((data, index) => (
                <Card key={index} className="p-4">
                  <CardSchedule data={data} />
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t">
            <span className="text-sm text-gray-600">
              Exibindo {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} de {totalItems} agendamentos
            </span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 text-sm font-medium border rounded ${currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
