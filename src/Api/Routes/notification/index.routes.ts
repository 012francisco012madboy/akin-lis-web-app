import { _axios } from "@/Api/axios.config";

class NotificationRoutes {
  async getNotificationsByUserId(userId: string) {
    const response = await _axios.get(`/notification/${userId}`);
    return response.data;
  }

  async updateNotificationStatus(notificationId: string) {
    const response = await _axios.patch(`/notification/${notificationId}/read`);
    return response.data;
  }
}

export const notificationRoutes = new NotificationRoutes();