import { apiClient } from './client';
import type { Timetable } from '@/types/api.types';

export const timetableApi = {
  getBySection: (sectionId: number): Promise<Timetable[]> =>
    apiClient.get(`/api/timetables/section/${sectionId}`),

  create: (data: Omit<Timetable, 'id'>): Promise<Timetable> =>
    apiClient.post('/api/timetables', data),

  update: (id: number, data: Partial<Omit<Timetable, 'id'>>): Promise<Timetable> =>
    apiClient.put(`/api/timetables/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/timetables/${id}`),
};
