"use client";

import { useState, useEffect, useCallback } from "react";
import { NotificationData, NotificationStats, NotificationFilters } from "@/Api/types/notification.d";
import { notificationRoutes } from "@/Api/Routes/notification/index.routes";

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar notificações
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await notificationRoutes.getNotificationsByUserId(userId);
      setNotifications(data);
    } catch (err) {
      setError("Erro ao carregar notificações");
      console.error("Erro ao buscar notificações:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Marcar como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationRoutes.updateNotificationStatus(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, lida: true }
            : notif
        )
      );
      return true;
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      return false;
    }
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.lida);

      for (const notif of unreadNotifications) {
        await notificationRoutes.updateNotificationStatus(notif.id);
      }

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, lida: true }))
      );
      return true;
    } catch (err) {
      console.error("Erro ao marcar todas as notificações como lidas:", err);
      return false;
    }
  }, [notifications]);

  // Filtrar notificações
  const filterNotifications = useCallback((filters: NotificationFilters) => {
    return notifications.filter(notif => {
      if (filters.lida !== undefined && notif.lida !== filters.lida) {
        return false;
      }
      if (filters.prioridade && notif.prioridade !== filters.prioridade) {
        return false;
      }
      if (filters.tipo_destinatario && notif.tipo_destinatario !== filters.tipo_destinatario) {
        return false;
      }
      if (filters.dataInicio && new Date(notif.criado_aos) < filters.dataInicio) {
        return false;
      }
      if (filters.dataFim && new Date(notif.criado_aos) > filters.dataFim) {
        return false;
      }
      return true;
    });
  }, [notifications]);

  // Obter estatísticas
  const getStats = useCallback((): NotificationStats => {
    const total = notifications.length;
    const naoLidas = notifications.filter(notif => !notif.lida).length;
    const criticas = notifications.filter(notif => notif.prioridade === "CRITICA").length;
    const altas = notifications.filter(notif => notif.prioridade === "ALTA").length;
    const normais = notifications.filter(notif => notif.prioridade === "NORMAL").length;
    const baixas = notifications.filter(notif => notif.prioridade === "BAIXA").length;

    return { total, naoLidas, criticas, altas, normais, baixas };
  }, [notifications]);

  // Buscar notificações ao montar o componente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling para verificar novas notificações
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(fetchNotifications, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    stats: getStats(),
    actions: {
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      filterNotifications,
      refresh: fetchNotifications
    }
  };
}

export default useNotifications;
