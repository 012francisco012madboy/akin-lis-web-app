import { InputText } from "@/components/input/input-text";
import CardSchdule from "./CardSchedule";
import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

interface ICardScheduleContainer {
  schedule: ScheduleType[];
  title: string;
  isLoading: boolean;
}

export default function CardScheduleContainer({ schedule, title, isLoading }: ICardScheduleContainer) {
  const [filteredSchedule, setFilteredSchedule] = useState<ScheduleType[]>(schedule);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchText: string) => {
    setIsSearching(!!searchText);

    const filtered = schedule.filter((s) =>
      s.Paciente?.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSchedule(filtered);
  };

  useEffect(() => {
    setFilteredSchedule(schedule);
  }, [schedule]);

  return (
    <section className="p-6 space-y-6 ">
      {/* Header */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between ">
        <h1 className="text-3xl font-semibold text-gray-900">
          {title} <span className="text-sm text-gray-600">({schedule.length})</span>
        </h1>

        <div className="flex items-center space-x-4">
          <InputText
            className="w-full max-w-xs"
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
          <ProgressSpinner
            style={{ width: "32px", height: "32px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
          />
        </div>
      ) : filteredSchedule.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Não há agendamentos disponíveis</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchedule.map((data, index) => (
            <CardSchdule key={index} data={data} />
          ))}
        </div>
      )}
    </section>
  );
}
