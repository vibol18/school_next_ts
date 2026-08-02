import { apiClient } from './client';
import {
  Assignment,
  AssignmentCreateInput,
  AssignmentUpdateInput,
} from '@/types/assignment.types';

export const assignmentApi = {
  // GET /api/assignments
  getAll: async (): Promise<Assignment[]> => {
    const response = await apiClient.get<Assignment[]>('/api/assignments');
    return response.data;
  },

  // GET /api/assignments/{id}
  getById: async (id: number): Promise<Assignment> => {
    const response = await apiClient.get<Assignment>(`/api/assignments/${id}`);
    return response.data;
  },

  // POST /api/assignments
  create: async (data: AssignmentCreateInput): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>('/api/assignments', data);
    return response.data;
  },

  // PUT /api/assignments/{id}
  update: async (id: number, data: AssignmentUpdateInput): Promise<Assignment> => {
    const response = await apiClient.put<Assignment>(`/api/assignments/${id}`, data);
    return response.data;
  },

  // DELETE /api/assignments/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/assignments/${id}`);
  },
};