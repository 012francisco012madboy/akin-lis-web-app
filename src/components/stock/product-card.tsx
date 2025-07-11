import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  TrendingDown,
  TrendingUp,
  Package,
  Beaker,
  Shield,
  Microscope,
  Droplets,
  Gauge,
  Stethoscope,
  Syringe
} from "lucide-react";

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

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Consumíveis":
      return <Package className="h-4 w-4" />;
    case "Reagentes Químicos e Biológicos":
      return <Beaker className="h-4 w-4" />;
    case "Produtos de Limpeza e Desinfecção":
      return <Droplets className="h-4 w-4" />;
    case "Materiais de Proteção Individual (EPIs)":
      return <Shield className="h-4 w-4" />;
    case "Vidrarias de Laboratório":
      return <Microscope className="h-4 w-4" />;
    case "Equipamentos e Instrumentos de Medição":
      return <Gauge className="h-4 w-4" />;
    case "Instrumentos de Diagnóstico e Kits de Teste":
      return <Stethoscope className="h-4 w-4" />;
    case "Soluções e Meios de Cultura":
      return <Syringe className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStockStatus = (current: number, threshold: number) => {
  if (current <= threshold * 0.5) {
    return { label: 'Crítico', color: 'destructive', icon: AlertTriangle };
  }
  if (current <= threshold) {
    return { label: 'Baixo', color: 'secondary', icon: TrendingDown };
  }
  return { label: 'Normal', color: 'default', icon: CheckCircle };
};

export function ProductCard({ product, onEdit, onViewDetails }: ProductCardProps) {
  const stockPercentage = Math.min((product.currentStock / product.initialStock) * 100, 100);
  const status = getStockStatus(product.currentStock, product.alertThreshold);
  const StatusIcon = status.icon;

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${product.isLowStock ? 'border-l-4 border-l-red-500' : ''
      }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(product.category)}
            <CardTitle className="text-base">{product.name}</CardTitle>
          </div>
          <Badge variant={status.color as any}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">{product.category}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Stock Atual</span>
            <span className={`font-medium ${product.isLowStock ? 'text-red-600' : 'text-green-600'
              }`}>
              {product.currentStock} {product.unit}
            </span>
          </div>

          <Progress
            value={stockPercentage}
            className="h-2"
            // @ts-ignore
            indicatorClassName={product.isLowStock ? 'bg-red-500' : 'bg-green-500'}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>Limite: {product.alertThreshold}</span>
            <span>{product.initialStock} {product.unit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Estoque Total</p>
            <p className="font-medium">{product.initialStock} {product.unit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Última Atualização</p>
            <p className="font-medium">
              {new Date(product.lastUpdated).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(product)}
          >
            <Edit className="mr-1 h-3 w-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(product)}
          >
            <Eye className="mr-1 h-3 w-3" />
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductList({ products, onEdit, onViewDetails }: ProductListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
