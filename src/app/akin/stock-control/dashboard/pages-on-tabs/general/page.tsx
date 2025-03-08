"use client";

import { BarChart, Bell, Boxes, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart as ShadBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { BarChartS } from "./barChart";
import { RadialChartS } from "./radialChart";

const stockData = [
  { name: "Reagente A", stock: 80 },
  { name: "Reagente B", stock: 45 },
  { name: "Reagente C", stock: 20 },
  { name: "Reagente D", stock: 10 },
];

const lowStockAlerts = stockData.filter((item) => item.stock < 30);

export default function StockControlDashboardGeneral() {
  return (
    <div className="p-6 space-y-6">
      {/* Gráfico de Estoque Atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center w-full gap-2">
            Estoque Atual
            <BarChartS    /> 
          </CardTitle>
        </CardHeader>
        <CardContent className="h-max w-full">
          {/* <ResponsiveContainer width="100%" height="100%">
            <ShadBarChart data={stockData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3b82f6" />
            </ShadBarChart>
          </ResponsiveContainer> */}

          <RadialChartS/>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} /> Produtos com Baixo Estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockAlerts.length > 0 ? (
            <ul className="space-y-2">
              {lowStockAlerts.map((item) => (
                <li key={item.name} className="p-2 bg-red-100 rounded-md">
                  ⚠️ {item.name}: {item.stock} unidades restantes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">✅ Todos os produtos estão com estoque suficiente.</p>
          )}
        </CardContent>
      </Card>

      {/* Botões de Acesso */}
      {/* <div className="flex gap-4 text-black">
        <Button variant="outline">
          <Boxes size={16} className="mr-2" /> Produtos
        </Button>
        <Button variant="outline">
          <FileText size={16} className="mr-2" /> Registro de Consumo
        </Button>
        <Button variant="outline">
          <FileText size={16} className="mr-2" /> Relatórios
        </Button>
      </div> */}
    </div>
  );
}
