"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, FlaskConical, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface ExamMetric {
  id: string;
  title: string;
  value: number;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

interface ExamMetricsProps {
  metrics: ExamMetric[];
}

export function ExamMetrics({ metrics }: ExamMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;

        return (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <IconComponent className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant="secondary"
                  className={`inline-flex items-center text-xs font-medium ${metric.changeType === 'increase'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                >
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </Badge>
                <span className="text-xs text-gray-500">vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Função para gerar métricas de exames com dados mock
export function generateExamMetrics(): ExamMetric[] {
  return [
    {
      id: '1',
      title: 'Exames Pendentes',
      value: 23,
      change: '+5.2%',
      changeType: 'increase',
      icon: Clock,
      description: 'Aguardando realização',
      color: 'text-orange-500'
    },
    {
      id: '2',
      title: 'Exames Concluídos',
      value: 127,
      change: '+12.3%',
      changeType: 'increase',
      icon: CheckCircle,
      description: 'Realizados este mês',
      color: 'text-green-500'
    },
    {
      id: '3',
      title: 'Em Andamento',
      value: 8,
      change: '+2.1%',
      changeType: 'increase',
      icon: FlaskConical,
      description: 'Sendo processados',
      color: 'text-blue-500'
    },
    {
      id: '4',
      title: 'Atrasados',
      value: 4,
      change: '-15.7%',
      changeType: 'decrease',
      icon: AlertTriangle,
      description: 'Precisam de atenção',
      color: 'text-red-500'
    }
  ];
}
