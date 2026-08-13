import { apiClient } from './client';
import {
  Assignment,
  AssignmentCreateInput,
  AssignmentUpdateInput,
} from '@/types/assignment.types';

export const assignmentApi = {
  // GET /api/assignments
  getAll: (): Promise<Assignment[]> =>
    apiClient.get('/api/assignments'),

  // GET /api/assignments/{id}
  getById: (id: number): Promise<Assignment> =>
    apiClient.get(`/api/assignments/${id}`),

  // POST /api/assignments
  create: (data: AssignmentCreateInput): Promise<Assignment> =>
    apiClient.post('/api/assignments', data),

  // PUT /api/assignments/{id}
  update: (id: number, data: AssignmentUpdateInput): Promise<Assignment> =>
    apiClient.put(`/api/assignments/${id}`, data),

  // DELETE /api/assignments/{id}
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/assignments/${id}`),
};
