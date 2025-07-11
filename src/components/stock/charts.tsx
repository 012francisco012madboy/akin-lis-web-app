import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockChartProps {
  data: Array<{
    name: string;
    current: number;
    max: number;
    isLowStock: boolean;
  }>;
}

export function StockChart({ data }: StockChartProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-24 text-sm font-medium truncate">{item.name}</div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${item.isLowStock
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                style={{ width: `${Math.min((item.current / item.max) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground w-20 text-right">
            {item.current}/{item.max}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ConsumptionTrendProps {
  data: Array<{
    date: string;
    consumption: number;
  }>;
}

export function ConsumptionTrend({ data }: ConsumptionTrendProps) {
  const maxConsumption = Math.max(...data.map(d => d.consumption));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end h-32">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="w-8 bg-gray-200 rounded-t flex items-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-700"
                style={{ height: `${(item.consumption / maxConsumption) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StockLevelIndicatorProps {
  current: number;
  max: number;
  threshold: number;
  unit: string;
}

export function StockLevelIndicator({ current, max, threshold, unit }: StockLevelIndicatorProps) {
  const percentage = (current / max) * 100;
  const thresholdPercentage = (threshold / max) * 100;

  const getColor = () => {
    if (current <= threshold * 0.5) return 'bg-red-500';
    if (current <= threshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Nível: {current} {unit}</span>
        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div
          className="absolute top-0 w-0.5 h-2 bg-gray-600"
          style={{ left: `${Math.min(thresholdPercentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Limite de alerta: {threshold} {unit}
      </div>
    </div>
  );
}
