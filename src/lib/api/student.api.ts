import { apiClient } from './client';
import type { Student } from '@/types/api.types';

export const studentApi = {
  getAll: (): Promise<Student[]> =>
    apiClient.get('/api/students'),

  getById: (id: number): Promise<Student> =>
    apiClient.get(`/api/students/${id}`),

  getFullProfile: (id: number): Promise<Student> =>
    apiClient.get(`/api/students/${id}/full-profile`),

  getBySection: (sectionId: number): Promise<Student[]> =>
    apiClient.get(`/api/students/section/${sectionId}`),

  create: (data: Omit<Student, 'id'>): Promise<Student> =>
    apiClient.post('/api/students', data),

  update: (id: number, data: Partial<Omit<Student, 'id'>>): Promise<Student> =>
    apiClient.put(`/api/students/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/students/${id}`),

  linkParent: (studentId: number, parentId: number): Promise<void> =>
    apiClient.post(`/api/students/${studentId}/parents/${parentId}`),
};
