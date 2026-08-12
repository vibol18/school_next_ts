import { apiClient } from './client';
import type { TransportRoute, TransportStop, StudentTransport } from '@/types/api.types';

// ── Transport Routes ───────────────────────────────────
export const transportRouteApi = {
  getAll: (): Promise<TransportRoute[]> =>
    apiClient.get('/api/transport/routes'),

  getById: (id: number): Promise<TransportRoute> =>
    apiClient.get(`/api/transport/routes/${id}`),

  create: (data: Omit<TransportRoute, 'id'>): Promise<TransportRoute> =>
    apiClient.post('/api/transport/routes', data),

  update: (id: number, data: Partial<Omit<TransportRoute, 'id'>>): Promise<TransportRoute> =>
    apiClient.put(`/api/transport/routes/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/transport/routes/${id}`),
};

// ── Transport Stops ────────────────────────────────────
export const transportStopApi = {
  getByRoute: (routeId: number): Promise<TransportStop[]> =>
    apiClient.get(`/api/transport/routes/${routeId}/stops`),

  create: (data: Omit<TransportStop, 'id'>): Promise<TransportStop> =>
    apiClient.post('/api/transport/stops', data),
};

// ── Student Transport Assignments ──────────────────────
export const studentTransportApi = {
  assign: (data: Omit<StudentTransport, 'id'>): Promise<StudentTransport> =>
    apiClient.post('/api/transport/assignments', data),

  getByStudent: (studentId: number): Promise<StudentTransport[]> =>
    apiClient.get(`/api/transport/assignments/student/${studentId}`),
};
