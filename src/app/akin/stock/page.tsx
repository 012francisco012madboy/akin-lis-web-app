"use client"

import { useState } from "react";
import { View } from "@/components/view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  FileText,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Eye,
  ShoppingCart,
  Beaker,
  Shield,
  Microscope,
  Stethoscope,
  Syringe,
  Droplets,
  Gauge
} from "lucide-react";
import { StockDashboard, QuickStats } from "@/components/stock/dashboard";
import { ProductList } from "@/components/stock/product-card";
import { StockChart, StockLevelIndicator } from "@/components/stock/charts";

// Tipos de dados
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

interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  alertThreshold: number;
  severity: 'low' | 'critical' | 'warning';
  createdAt: string;
}

// Dados simulados
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Álcool 70%",
    category: "Produtos de Limpeza e Desinfecção",
    unit: "mL",
    currentStock: 45,
    initialStock: 500,
    alertThreshold: 100,
    lastUpdated: "2025-01-10",
    isLowStock: true
  },
  {
    id: 2,
    name: "Luvas Descartáveis",
    category: "Materiais de Proteção Individual (EPIs)",
    unit: "unidade",
    currentStock: 8,
    initialStock: 50,
    alertThreshold: 10,
    lastUpdated: "2025-01-10",
    isLowStock: true
  },
  {
    id: 3,
    name: "Pipetas Descartáveis",
    category: "Consumíveis",
    unit: "unidade",
    currentStock: 150,
    initialStock: 200,
    alertThreshold: 50,
    lastUpdated: "2025-01-09",
    isLowStock: false
  },
  {
    id: 4,
    name: "Reagente Hematologia",
    category: "Reagentes Químicos e Biológicos",
    unit: "mL",
    currentStock: 25,
    initialStock: 100,
    alertThreshold: 30,
    lastUpdated: "2025-01-08",
    isLowStock: true
  },
  {
    id: 5,
    name: "Tubos de Ensaio",
    category: "Vidrarias de Laboratório",
    unit: "unidade",
    currentStock: 75,
    initialStock: 100,
    alertThreshold: 20,
    lastUpdated: "2025-01-10",
    isLowStock: false
  }
];

const MOCK_CONSUMPTION: ConsumptionRecord[] = [
  {
    id: 1,
    productId: 1,
    productName: "Álcool 70%",
    quantityUsed: 15,
    date: "2025-01-10",
    shift: "Manhã",
    technician: "João Silva",
    observations: "Limpeza geral do laboratório"
  },
  {
    id: 2,
    productId: 2,
    productName: "Luvas Descartáveis",
    quantityUsed: 4,
    date: "2025-01-10",
    shift: "Tarde",
    technician: "Maria Santos",
  },
  {
    id: 3,
    productId: 3,
    productName: "Pipetas Descartáveis",
    quantityUsed: 10,
    date: "2025-01-09",
    shift: "Manhã",
    technician: "Pedro Costa",
  }
];

const MOCK_ALERTS: StockAlert[] = [
  {
    id: 1,
    productId: 1,
    productName: "Álcool 70%",
    currentStock: 45,
    alertThreshold: 100,
    severity: 'critical',
    createdAt: "2025-01-10T08:00:00Z"
  },
  {
    id: 2,
    productId: 2,
    productName: "Luvas Descartáveis",
    currentStock: 8,
    alertThreshold: 10,
    severity: 'warning',
    createdAt: "2025-01-10T09:30:00Z"
  },
  {
    id: 3,
    productId: 4,
    productName: "Reagente Hematologia",
    currentStock: 25,
    alertThreshold: 30,
    severity: 'low',
    createdAt: "2025-01-09T14:15:00Z"
  }
];

const PRODUCT_CATEGORIES = [
  "Consumíveis",
  "Reagentes Químicos e Biológicos",
  "Produtos de Limpeza e Desinfecção",
  "Materiais de Proteção Individual (EPIs)",
  "Vidrarias de Laboratório",
  "Materiais Plásticos e Descartáveis",
  "Equipamentos e Instrumentos de Medição",
  "Equipamentos de Processamento e Análise",
  "Soluções e Meios de Cultura",
  "Instrumentos de Diagnóstico e Kits de Teste",
  "Materiais de Armazenamento e Transporte",
  "Acessórios e Suprimentos Diversos"
];

const UNITS = [
  "mL", "L", "µL", "dL", "g", "kg", "mg", "µg", "unidade", "peça", "frasco", "pacote", "caixa", "kit", "m", "cm", "mm", "m²", "cm²", "M", "mM", "µM", "bandeja", "rolo", "cartucho"
];

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

export default function StockControlPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [consumption, setConsumption] = useState<ConsumptionRecord[]>(MOCK_CONSUMPTION);
  const [alerts, setAlerts] = useState<StockAlert[]>(MOCK_ALERTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isConsumptionOpen, setIsConsumptionOpen] = useState(false);
  const [isAlertsConfigOpen, setIsAlertsConfigOpen] = useState(false);

  // Formulário de produto
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    unit: "",
    initialStock: "",
    alertThreshold: ""
  });

  // Formulário de consumo
  const [consumptionForm, setConsumptionForm] = useState({
    productId: "",
    quantityUsed: "",
    shift: "",
    technician: "",
    observations: ""
  });

  // Filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(product => product.isLowStock);
  const criticalStockProducts = products.filter(product => product.currentStock < product.alertThreshold * 0.5);

  // Estatísticas do dashboard
  const totalProducts = products.length;
  const lowStockCount = lowStockProducts.length;
  const criticalStockCount = criticalStockProducts.length;
  const averageStockLevel = Math.round(products.reduce((acc, product) => acc + (product.currentStock / product.initialStock * 100), 0) / products.length);

  const handleAddProduct = () => {
    if (productForm.name && productForm.category && productForm.unit && productForm.initialStock && productForm.alertThreshold) {
      const newProduct: Product = {
        id: Date.now(),
        name: productForm.name,
        category: productForm.category,
        unit: productForm.unit,
        currentStock: parseFloat(productForm.initialStock),
        initialStock: parseFloat(productForm.initialStock),
        alertThreshold: parseFloat(productForm.alertThreshold),
        lastUpdated: new Date().toISOString().split('T')[0],
        isLowStock: parseFloat(productForm.initialStock) <= parseFloat(productForm.alertThreshold)
      };
      setProducts([...products, newProduct]);
      setProductForm({ name: "", category: "", unit: "", initialStock: "", alertThreshold: "" });
      setIsAddProductOpen(false);
    }
  };

  const handleRecordConsumption = () => {
    if (consumptionForm.productId && consumptionForm.quantityUsed && consumptionForm.shift && consumptionForm.technician) {
      const product = products.find(p => p.id === parseInt(consumptionForm.productId));
      if (product) {
        const newConsumption: ConsumptionRecord = {
          id: Date.now(),
          productId: parseInt(consumptionForm.productId),
          productName: product.name,
          quantityUsed: parseFloat(consumptionForm.quantityUsed),
          date: new Date().toISOString().split('T')[0],
          shift: consumptionForm.shift,
          technician: consumptionForm.technician,
          observations: consumptionForm.observations
        };

        // Atualizar estoque
        const updatedProducts = products.map(p => {
          if (p.id === parseInt(consumptionForm.productId)) {
            const newStock = p.currentStock - parseFloat(consumptionForm.quantityUsed);
            return {
              ...p,
              currentStock: Math.max(0, newStock),
              isLowStock: newStock <= p.alertThreshold,
              lastUpdated: new Date().toISOString().split('T')[0]
            };
          }
          return p;
        });

        setProducts(updatedProducts);
        setConsumption([...consumption, newConsumption]);
        setConsumptionForm({ productId: "", quantityUsed: "", shift: "", technician: "", observations: "" });
        setIsConsumptionOpen(false);
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Controlo de Stock</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsAddProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
          <Button variant="outline" onClick={() => setIsConsumptionOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Registrar Consumo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-4">
          <StockDashboard products={products} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Situação Atual do Stock</CardTitle>
                <CardDescription>
                  Gráfico de barras mostrando o estoque atual de cada produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockChart
                  data={products.slice(0, 5).map(product => ({
                    name: product.name,
                    current: product.currentStock,
                    max: product.initialStock,
                    isLowStock: product.isLowStock
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Alertas de Stock</CardTitle>
                <CardDescription>
                  Produtos que requerem atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {alert.currentStock} (Limite: {alert.alertThreshold})
                        </p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Button size="lg" className="h-16" onClick={() => setActiveTab("products")}>
              <Package className="mr-2 h-6 w-6" />
              Produtos
            </Button>
            <Button size="lg" className="h-16" variant="outline" onClick={() => setIsConsumptionOpen(true)}>
              <ShoppingCart className="mr-2 h-6 w-6" />
              Registro de Consumo
            </Button>
            <Button size="lg" className="h-16" variant="outline" onClick={() => setActiveTab("reports")}>
              <BarChart3 className="mr-2 h-6 w-6" />
              Relatórios
            </Button>
          </div>
        </TabsContent>

        {/* PRODUTOS */}
        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ProductList
            products={filteredProducts}
            onEdit={(product) => {
              // Implementar edição de produto
              console.log('Editar produto:', product);
            }}
            onViewDetails={(product) => {
              // Implementar visualização de detalhes
              console.log('Ver detalhes:', product);
            }}
          />
        </TabsContent>

        {/* ALERTAS */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Alertas de Stock</h3>
              <p className="text-sm text-muted-foreground">
                Produtos que requerem atenção imediata
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsAlertsConfigOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar Alertas
            </Button>
          </div>

          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'warning' ? 'border-l-yellow-500' : 'border-l-orange-500'
                }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-100' :
                          alert.severity === 'warning' ? 'bg-yellow-100' : 'bg-orange-100'
                        }`}>
                        <AlertTriangle className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-red-600' :
                            alert.severity === 'warning' ? 'text-yellow-600' : 'text-orange-600'
                          }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{alert.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Stock atual: {alert.currentStock} (Limite: {alert.alertThreshold})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* RELATÓRIOS */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Consumo por Categoria</CardTitle>
                <CardDescription>Análise do consumo por tipo de produto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-8 w-8 mr-2" />
                  Gráfico de Pizza - Consumo por Categoria
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Consumo</CardTitle>
                <CardDescription>Consumo semanal dos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mr-2" />
                  Gráfico de Linha - Tendência de Consumo
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Previsão de Reabastecimento</CardTitle>
              <CardDescription>Sugestões baseadas no histórico de consumo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Álcool 70%</p>
                      <p className="text-sm text-muted-foreground">Previsão de esgotamento: 5 dias</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">Repor 200 mL</p>
                    <p className="text-sm text-muted-foreground">Sugestão</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Luvas Descartáveis</p>
                      <p className="text-sm text-muted-foreground">Previsão de esgotamento: 3 dias</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600">Repor 20 unidades</p>
                    <p className="text-sm text-muted-foreground">Sugestão</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Beaker className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Reagente Hematologia</p>
                      <p className="text-sm text-muted-foreground">Previsão de esgotamento: 2 dias</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">Repor 100 mL</p>
                    <p className="text-sm text-muted-foreground">Urgente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por Data
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por Categoria
              </Button>
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* DIÁLOGO ADICIONAR PRODUTO */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastro de Produto</DialogTitle>
            <DialogDescription>
              Adicione um novo produto ao estoque do laboratório.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  placeholder="Ex: Álcool 70%"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={productForm.category} onValueChange={(value) => setProductForm({ ...productForm, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select value={productForm.unit} onValueChange={(value) => setProductForm({ ...productForm, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialStock">Quantidade Inicial</Label>
                <Input
                  id="initialStock"
                  type="number"
                  placeholder="Ex: 500"
                  value={productForm.initialStock}
                  onChange={(e) => setProductForm({ ...productForm, initialStock: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Limiar de Alerta</Label>
              <Input
                id="alertThreshold"
                type="number"
                placeholder="Ex: 100"
                value={productForm.alertThreshold}
                onChange={(e) => setProductForm({ ...productForm, alertThreshold: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddProduct}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO REGISTRO DE CONSUMO */}
      <Dialog open={isConsumptionOpen} onOpenChange={setIsConsumptionOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registro de Consumo</DialogTitle>
            <DialogDescription>
              Registre o consumo de produtos no final do turno.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Produto</Label>
                <Select value={consumptionForm.productId} onValueChange={(value) => setConsumptionForm({ ...consumptionForm, productId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name} ({product.currentStock} {product.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityUsed">Quantidade Utilizada</Label>
                <Input
                  id="quantityUsed"
                  type="number"
                  placeholder="Ex: 10.5"
                  value={consumptionForm.quantityUsed}
                  onChange={(e) => setConsumptionForm({ ...consumptionForm, quantityUsed: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select value={consumptionForm.shift} onValueChange={(value) => setConsumptionForm({ ...consumptionForm, shift: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Técnico</Label>
                <Input
                  id="technician"
                  placeholder="Nome do técnico"
                  value={consumptionForm.technician}
                  onChange={(e) => setConsumptionForm({ ...consumptionForm, technician: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações (Opcional)</Label>
              <Textarea
                id="observations"
                placeholder="Observações sobre o turno..."
                value={consumptionForm.observations}
                onChange={(e) => setConsumptionForm({ ...consumptionForm, observations: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConsumptionOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRecordConsumption}>
                Confirmar e Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
