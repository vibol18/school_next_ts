import { apiClient } from './client';
import type { User } from '@/types/api.types';

export const userApi = {
  getAll: (): Promise<User[]> =>
    apiClient.get('/api/users'),

  getById: (id: number): Promise<User> =>
    apiClient.get(`/api/users/${id}`),

  updateStatus: (id: number, status: string): Promise<User> =>
    apiClient.patch(`/api/users/${id}/status`, { status }),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/users/${id}`),
};
