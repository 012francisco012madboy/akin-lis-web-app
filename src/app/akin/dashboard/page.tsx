import { View } from "@/components/view";
import { MOCK_LOGGED_USER } from "@/mocks/logged-user";
import { CalendarArrowDown, ClockArrowDown, TrendingUp, UserRound } from "lucide-react";
import VerticalBarChart from "./chart-a";
import DoughnutChart from "./chart-b";
import CustomBreadcrumb from "@/components/custom-breadcrumb";

interface IDashboard {}

const MOCK_RESUME = [
  { id: 58, label: "Solicitações Pendentes", value: 6, icon: UserRound },
  { id: 58, label: "Exames Pendentes", value: 465, icon: ClockArrowDown },
  { id: 1, label: "Exames a Decorrer", value: 8, icon: TrendingUp },
  { id: 64, label: "Agendamentos", value: 4, icon: CalendarArrowDown },
];

const breadcrumbItems = [
  {
    label: "Painel",
  },
];

export default function Dashboard({}: IDashboard) {
  return (
    <View.Vertical className="h-screen space-y-4 px-1 py-0">
      {/* Cabeçalho com Breadcrumb */}
      <CustomBreadcrumb items={breadcrumbItems} borderB />

      {/* Cartões de Resumo */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_RESUME.map((data) => (
          <article
            key={data.id}
            className="flex flex-col p-4 space-y-3 rounded-lg border border-gray-200 shadow hover:shadow-lg transition"
            aria-label={data.label}
          >
            <header className="border-b pb-2 text-lg font-semibold">{data.label}</header>
            <div className="flex items-center space-x-3">
              <data.icon
                size={40}
                className="p-2 text-sky-500 bg-sky-100 rounded-lg"
                aria-hidden="true"
              />
              <p className="text-2xl font-bold">{data.value}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="p-6 rounded-lg border border-gray-200 shadow hover:shadow-lg transition">
          <header className="mb-4 text-xl font-semibold">Receita por Mês</header>
          <VerticalBarChart />
        </article>
        <article className="p-6 rounded-lg border border-gray-200 shadow hover:shadow-lg transition">
          <header className="mb-4 text-xl font-semibold">Receita por X</header>
          <DoughnutChart />
        </article>
      </section>
    </View.Vertical>
  );
}
