"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Bell,
  BellRing,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { NotificationData, PrioridadeNotificacao, NotificationStats } from "@/Api/types/notification.d";
import { notificationRoutes } from "@/Api/Routes/notification/index.routes";

// Mock data para demonstração
const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: "1",
    titulo: "Estoque Baixo",
    mensagem: "O material 'Seringas 5ml' está com estoque baixo (apenas 5 unidades restantes)",
    lida: false,
    tipo_destinatario: "CHEFE",
    acao_url: "/akin/stock-control/product",
    prioridade: "ALTA",
    criado_aos: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    id_usuario: "user-1",
    usuario: { id: "user-1", nome: "Sistema", email: "sistema@akin.com" }
  },
  {
    id: "2",
    titulo: "Novo Agendamento",
    mensagem: "Paciente Maria Silva agendou exame de hemograma para amanhã às 14:00",
    lida: false,
    tipo_destinatario: "TECNICO",
    acao_url: "/akin/schedule/request",
    prioridade: "NORMAL",
    criado_aos: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    id_usuario: "user-2",
    usuario: { id: "user-2", nome: "Maria Silva", email: "maria@email.com" }
  },
  {
    id: "3",
    titulo: "Resultado Crítico",
    mensagem: "Resultado de exame com valores críticos detectados para o paciente João Santos",
    lida: true,
    tipo_destinatario: "CHEFE",
    acao_url: "/akin/report",
    prioridade: "CRITICA",
    criado_aos: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 horas atrás
    id_usuario: "user-3",
    usuario: { id: "user-3", nome: "Dr. Carlos", email: "carlos@akin.com" }
  },
  {
    id: "4",
    titulo: "Manutenção Equipamento",
    mensagem: "Lembrete: manutenção preventiva do microscópio agendada para hoje às 16:00",
    lida: false,
    tipo_destinatario: "TECNICO",
    prioridade: "NORMAL",
    criado_aos: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
    id_usuario: "user-4",
    usuario: { id: "user-4", nome: "Sistema", email: "sistema@akin.com" }
  },
  {
    id: "5",
    titulo: "Nova Mensagem",
    mensagem: "Você recebeu uma nova mensagem de Ana Costa sobre o protocolo de coleta",
    lida: true,
    tipo_destinatario: "TECNICO",
    acao_url: "/akin/message",
    prioridade: "BAIXA",
    criado_aos: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    id_usuario: "user-5",
    usuario: { id: "user-5", nome: "Ana Costa", email: "ana@akin.com" }
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>(MOCK_NOTIFICATIONS);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>(MOCK_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<PrioridadeNotificacao | "TODAS">("TODAS");
  const [filterStatus, setFilterStatus] = useState<"TODAS" | "LIDAS" | "NAO_LIDAS">("TODAS");
  const [selectedTab, setSelectedTab] = useState("todas");

  // Aplicar filtros
  useEffect(() => {
    let filtered = notifications;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (notif) =>
          notif.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notif.mensagem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por prioridade
    if (filterPriority !== "TODAS") {
      filtered = filtered.filter((notif) => notif.prioridade === filterPriority);
    }

    // Filtro por status de leitura
    if (filterStatus === "LIDAS") {
      filtered = filtered.filter((notif) => notif.lida);
    } else if (filterStatus === "NAO_LIDAS") {
      filtered = filtered.filter((notif) => !notif.lida);
    }

    // Filtro por aba
    if (selectedTab === "nao_lidas") {
      filtered = filtered.filter((notif) => !notif.lida);
    } else if (selectedTab === "criticas") {
      filtered = filtered.filter((notif) => notif.prioridade === "CRITICA");
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterPriority, filterStatus, selectedTab]);

  // Marcar como lida
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationRoutes.updateNotificationStatus(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, lida: true } : notif
        )
      );
      toast.success("Notificação marcada como lida");
    } catch (error) {
      toast.error("Erro ao marcar notificação como lida");
    }
  };

  // Marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notif) => !notif.lida);

      for (const notif of unreadNotifications) {
        await notificationRoutes.updateNotificationStatus(notif.id);
      }

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, lida: true }))
      );
      toast.success("Todas as notificações foram marcadas como lidas");
    } catch (error) {
      toast.error("Erro ao marcar todas as notificações como lidas");
    }
  };

  // Remover notificação (simulação)
  const handleDeleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    toast.success("Notificação removida");
  };

  // Obter estatísticas
  const getStats = (): NotificationStats => {
    const total = notifications.length;
    const naoLidas = notifications.filter((notif) => !notif.lida).length;
    const criticas = notifications.filter((notif) => notif.prioridade === "CRITICA").length;
    const altas = notifications.filter((notif) => notif.prioridade === "ALTA").length;
    const normais = notifications.filter((notif) => notif.prioridade === "NORMAL").length;
    const baixas = notifications.filter((notif) => notif.prioridade === "BAIXA").length;

    return { total, naoLidas, criticas, altas, normais, baixas };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-akin-turquoise" />
            Notificações
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas notificações e alertas do sistema
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleMarkAllAsRead}
            className="bg-akin-turquoise hover:bg-akin-turquoise/80"
            disabled={stats.naoLidas === 0}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-red-600">{stats.naoLidas}</p>
            </div>
            <BellRing className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Críticas</p>
              <p className="text-2xl font-bold text-red-800">{stats.criticas}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-700" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Altas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.altas}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Normais</p>
              <p className="text-2xl font-bold text-blue-600">{stats.normais}</p>
            </div>
            <Info className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterPriority} onValueChange={(value: PrioridadeNotificacao | "TODAS") => setFilterPriority(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas as prioridades</SelectItem>
                <SelectItem value="CRITICA">Crítica</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="BAIXA">Baixa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: "TODAS" | "LIDAS" | "NAO_LIDAS") => setFilterStatus(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas</SelectItem>
                <SelectItem value="NAO_LIDAS">Não lidas</SelectItem>
                <SelectItem value="LIDAS">Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e Lista de Notificações */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="todas"
            className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white"
          >
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger
            value="nao_lidas"
            className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white"
          >
            Não Lidas ({stats.naoLidas})
          </TabsTrigger>
          <TabsTrigger
            value="criticas"
            className="data-[state=active]:bg-akin-turquoise data-[state=active]:text-white"
          >
            Críticas ({stats.criticas})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma notificação encontrada
                </h3>
                <p className="text-gray-600 text-center">
                  Não há notificações que correspondam aos filtros selecionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente para exibir uma notificação individual
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const getPriorityBadge = (priority: PrioridadeNotificacao) => {
    const variants = {
      CRITICA: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
      ALTA: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertCircle },
      NORMAL: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Info },
      BAIXA: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Info },
    };

    const variant = variants[priority];
    const Icon = variant.icon;

    return (
      <Badge variant="outline" className={`${variant.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {priority}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${!notification.lida ? 'border-l-4 border-l-akin-turquoise bg-blue-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Header da notificação */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <h3 className={`font-semibold ${!notification.lida ? 'text-gray-900' : 'text-gray-700'}`}>
                  {notification.titulo}
                </h3>
                {!notification.lida && (
                  <div className="w-2 h-2 bg-akin-turquoise rounded-full"></div>
                )}
              </div>
              {getPriorityBadge(notification.prioridade)}
            </div>

            {/* Mensagem */}
            <p className="text-gray-600 leading-relaxed">
              {notification.mensagem}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(notification.criado_aos)}
                </div>
                {notification.usuario && (
                  <div className="flex items-center gap-1">
                    <span>Por: {notification.usuario.nome}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Botão de ação */}
                {notification.acao_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = notification.acao_url!}
                    className="text-akin-turquoise border-akin-turquoise hover:bg-akin-turquoise hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver detalhes
                  </Button>
                )}

                {/* Marcar como lida */}
                {!notification.lida && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Marcar como lida
                  </Button>
                )}

                {/* Deletar */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover Notificação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover esta notificação? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(notification.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
