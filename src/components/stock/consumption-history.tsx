import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  Package,
  Calendar,
  TrendingDown,
  Eye,
  FileText
} from "lucide-react";

interface ConsumptionRecord {
  id: number;
  productId: number;
  productName: string;
  quantityUsed: number;
  date: string;
  shift: string;
  technician: string;
  observations?: string;
}

interface ConsumptionHistoryProps {
  records: ConsumptionRecord[];
  onViewDetails?: (record: ConsumptionRecord) => void;
}

export function ConsumptionHistory({ records, onViewDetails }: ConsumptionHistoryProps) {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getShiftBadgeColor = (shift: string) => {
    switch (shift.toLowerCase()) {
      case 'manhã':
        return 'default';
      case 'tarde':
        return 'secondary';
      case 'noite':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Histórico de Consumo</h3>
          <p className="text-sm text-muted-foreground">
            Registros de consumo por turno
          </p>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Exportar Histórico
        </Button>
      </div>

      <div className="space-y-3">
        {sortedRecords.map((record) => (
          <Card key={record.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{record.productName}</h4>
                      <Badge variant={getShiftBadgeColor(record.shift)}>
                        {record.shift}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-3 w-3" />
                        <span>Consumido: {record.quantityUsed}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(record.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{record.technician}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Turno: {record.shift}</span>
                      </div>
                    </div>
                    {record.observations && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Observações: </span>
                        {record.observations}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails?.(record)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface ConsumptionSummaryProps {
  period: 'daily' | 'weekly' | 'monthly';
  data: Array<{
    productName: string;
    totalConsumed: number;
    unit: string;
    averageDaily: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export function ConsumptionSummary({ period, data }: ConsumptionSummaryProps) {
  const periodLabels = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Consumo {periodLabels[period]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded">
                  <Package className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Média diária: {item.averageDaily} {item.unit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {item.totalConsumed} {item.unit}
                  </span>
                  <div className={`p-1 rounded ${item.trend === 'up' ? 'bg-red-100 text-red-600' :
                      item.trend === 'down' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {item.trend === 'up' ? (
                      <TrendingDown className="h-3 w-3 rotate-180" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <div className="h-3 w-3 bg-gray-400 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
