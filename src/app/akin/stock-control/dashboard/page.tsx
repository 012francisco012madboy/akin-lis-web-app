"use client";

import { useState } from "react";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const breadcrumbItems = [{ label: "Painel " }];

export default function StockControlDashboard() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <main className="w-full h-full p-4 text-white font-semibold text-lg overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col md:flex-row justify-start w-full md:justify-between md:items-center ">
        <CustomBreadcrumb items={breadcrumbItems} />
        <Tabs defaultValue="general" className="mx-auto md:mx-0 md:mr-2" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold"
            >
              Geral
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold"
            >
              Notificações
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold"
            >
              Relatórios
            </TabsTrigger>
            <TabsTrigger
              value="consumption"
              className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white font-semibold"
            >
              Consumo
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="w-full h-[0.5px] bg-black/20 my-1"></div>
      <div className="w-full h-full bg-slate-400 p-4 text-white font-semibold text-lg ">
        {activeTab === "general" && <p>Exibindo: Geral</p>}
        {activeTab === "notifications" && <p>Exibindo: Notificações</p>}
        {activeTab === "reports" && <p>Exibindo: Relatórios</p>}
        {activeTab === "consumption" && <p>Exibindo: Consumo</p>}
      </div>
    </main>
  );
}
