import { Input } from "@/components/input";
import { Skeleton } from "@/components/ui/skeleton";


export function ScheduleDetails({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-200 space-y-4">
      {/* Título */}
      <h2 className="font-semibold text-lg text-gray-800">Detalhes do Agendamento</h2>
      <hr className="border-gray-300" />

      {/* Conteúdo */}
      {isLoading ? (
        <div className="flex w-[400px] gap-4 mt-4">
          <Skeleton className="w-full h-12 rounded-md" />
          <Skeleton className="w-full h-12 rounded-md" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <Input.CalenderDate
            valueDate={new Date()}
            minDate={new Date()}
            name="schedule_date"
            className="flex-1 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Input.CalenderTime
            name="schedule_time"
            className="flex-1 bg-gray-50 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}