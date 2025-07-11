import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  AlertTriangle,
  XCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Activity
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  color?: 'default' | 'red' | 'yellow' | 'green' | 'blue';
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  color = 'default'
}: StatsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'text-red-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${getColorClasses()} opacity-70`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={`text-2xl font-bold ${getColorClasses()}`}>
            {value}
          </div>
          {trend && (
            <Badge variant={trend.type === 'increase' ? 'default' : trend.type === 'decrease' ? 'secondary' : 'outline'}>
              {trend.type === 'increase' ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : trend.type === 'decrease' ? (
                <TrendingDown className="mr-1 h-3 w-3" />
              ) : (
                <Activity className="mr-1 h-3 w-3" />
              )}
              {trend.value}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  initialStock: number;
  alertThreshold: number;
  lastUpdated: string;
  isLowStock: boolean;
}

interface StockDashboardProps {
  products: Product[];
}

export function StockDashboard({ products }: StockDashboardProps) {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.isLowStock);
  const criticalStockProducts = products.filter(product => product.currentStock < product.alertThreshold * 0.5);
  const averageStockLevel = products.length > 0
    ? Math.round(products.reduce((acc, product) => acc + (product.currentStock / product.initialStock * 100), 0) / products.length)
    : 0;

  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      description: "Produtos cadastrados no sistema",
      icon: <Package className="h-4 w-4" />,
      color: 'default' as const
    },
    {
      title: "Stock Baixo",
      value: lowStockProducts.length,
      description: "Produtos abaixo do limite",
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'yellow' as const
    },
    {
      title: "Stock Crítico",
      value: criticalStockProducts.length,
      description: "Produtos em situação crítica",
      icon: <XCircle className="h-4 w-4" />,
      color: 'red' as const
    },
    {
      title: "Nível Médio",
      value: `${averageStockLevel}%`,
      description: "Nível médio do estoque",
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'blue' as const
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

interface QuickStatsProps {
  title: string;
  items: Array<{
    label: string;
    value: number;
    unit: string;
    status: 'normal' | 'warning' | 'critical';
  }>;
}

export function QuickStats({ title, items }: QuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.status === 'critical' ? 'bg-red-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm font-medium">
                {item.value} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
