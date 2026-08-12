import { apiClient } from './client';
import type { Notification } from '@/types/school.types';

export const notificationApi = {
  getAll: (): Promise<Notification[]> =>
    apiClient.get('/api/notifications'),

  getByRecipient: (recipientId: number, type?: string): Promise<Notification[]> =>
    apiClient.get(`/api/notifications/recipient/${recipientId}`, {
      params: type ? { type } : undefined,
    }),

  create: (data: Partial<Omit<Notification, 'id' | 'createdAt'>>): Promise<Notification> =>
    apiClient.post('/api/notifications', data),

  markRead: (id: number): Promise<Notification> =>
    apiClient.patch(`/api/notifications/${id}/read`),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/notifications/${id}`),
};
