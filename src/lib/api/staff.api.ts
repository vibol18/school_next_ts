import { apiClient } from './client';
import type { Staff } from '@/types/api.types';

export const staffApi = {
  getAll: (): Promise<Staff[]> =>
    apiClient.get('/api/staff'),

  getById: (id: number): Promise<Staff> =>
    apiClient.get(`/api/staff/${id}`),

  create: (data: Omit<Staff, 'id'>): Promise<Staff> =>
    apiClient.post('/api/staff', data),

  update: (id: number, data: Partial<Omit<Staff, 'id'>>): Promise<Staff> =>
    apiClient.put(`/api/staff/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/staff/${id}`),
};
