import { apiClient } from './client';
import type { Assignment, Submission } from '@/types/api.types';

export const assignmentApi = {
  getAll: (): Promise<Assignment[]> =>
    apiClient.get('/api/assignments'),

  getById: (id: number): Promise<Assignment> =>
    apiClient.get(`/api/assignments/${id}`),

  getBySection: (sectionId: number): Promise<Assignment[]> =>
    apiClient.get(`/api/assignments/section/${sectionId}`),

  create: (data: Omit<Assignment, 'id'>): Promise<Assignment> =>
    apiClient.post('/api/assignments', data),

  update: (id: number, data: Partial<Omit<Assignment, 'id'>>): Promise<Assignment> =>
    apiClient.put(`/api/assignments/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/assignments/${id}`),
};

export const submissionApi = {
  create: (data: Omit<Submission, 'id' | 'submittedAt'>): Promise<Submission> =>
    apiClient.post('/api/assignment-submissions', data),

  grade: (id: number, data: { grade: string; feedback: string }): Promise<Submission> =>
    apiClient.patch(`/api/assignment-submissions/${id}/grade`, data),

  getByAssignment: (assignmentId: number): Promise<Submission[]> =>
    apiClient.get(`/api/assignment-submissions/assignment/${assignmentId}`),

  getByStudent: (studentId: number): Promise<Submission[]> =>
    apiClient.get(`/api/assignment-submissions/student/${studentId}`),
};
