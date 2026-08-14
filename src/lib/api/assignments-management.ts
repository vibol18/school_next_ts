import { apiClient } from './client';
import { sectionsApi } from './academic';
import {
  Assignment,
  AssignmentCreateInput,
  AssignmentUpdateInput,
} from '@/types/assignment.types';

const uniqueById = (items: Assignment[]) => {
  const seen = new Map<number, Assignment>();
  items.forEach((item) => {
    if (!seen.has(item.id)) seen.set(item.id, item);
  });
  return Array.from(seen.values());
};

export const assignmentApi = {
  // NOTE: the backend exposes no GET /api/assignments list endpoint, so we
  // list assignments by fetching every section and merging the results.
  getAll: async (): Promise<Assignment[]> => {
    try {
      const sections = await sectionsApi.getAll();
      const results = await Promise.all(
        sections.map((section: { id: number }) =>
          apiClient
            .get(`/api/assignments/section/${section.id}`)
            .catch(() => [] as Assignment[])
        )
      );
      return uniqueById((results as Assignment[][]).flat());
    } catch {
      return [];
    }
  },

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
