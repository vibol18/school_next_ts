import { apiClient } from './client';
import type { Event, Notice, Message, LeaveApplication, LeaveStatus } from '@/types/api.types';

// ── Events ─────────────────────────────────────────────
export const eventApi = {
  getAll: (): Promise<Event[]> =>
    apiClient.get('/api/events'),

  getById: (id: number): Promise<Event> =>
    apiClient.get(`/api/events/${id}`),

  create: (data: Omit<Event, 'id' | 'createdAt'>): Promise<Event> =>
    apiClient.post('/api/events', data),

  update: (id: number, data: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<Event> =>
    apiClient.put(`/api/events/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/events/${id}`),
};

// ── Notices ────────────────────────────────────────────
export const noticeApi = {
  getAll: (): Promise<Notice[]> =>
    apiClient.get('/api/notices'),

  getById: (id: number): Promise<Notice> =>
    apiClient.get(`/api/notices/${id}`),

  create: (data: Omit<Notice, 'id' | 'publishedAt'>): Promise<Notice> =>
    apiClient.post('/api/notices', data),

  update: (id: number, data: Partial<Omit<Notice, 'id' | 'publishedAt'>>): Promise<Notice> =>
    apiClient.put(`/api/notices/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/notices/${id}`),
};

// ── Messages ───────────────────────────────────────────
export const messageApi = {
  getAll: (): Promise<Message[]> =>
    apiClient.get('/api/messages'),

  getById: (id: number): Promise<Message> =>
    apiClient.get(`/api/messages/${id}`),

  getInbox: (receiver?: string): Promise<Message[]> =>
    apiClient.get('/api/messages/inbox', { params: receiver ? { receiver } : undefined }),

  send: (data: Omit<Message, 'id' | 'isRead' | 'sentAt'>): Promise<Message> =>
    apiClient.post('/api/messages', data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/messages/${id}`),
};

// ── Leave Applications ─────────────────────────────────
export const leaveApplicationApi = {
  getAll: (): Promise<LeaveApplication[]> =>
    apiClient.get('/api/leave-applications'),

  getById: (id: number): Promise<LeaveApplication> =>
    apiClient.get(`/api/leave-applications/${id}`),

  create: (data: Omit<LeaveApplication, 'id' | 'appliedAt' | 'status'>): Promise<LeaveApplication> =>
    apiClient.post('/api/leave-applications', data),

  updateStatus: (id: number, status: LeaveStatus): Promise<LeaveApplication> =>
    apiClient.patch(`/api/leave-applications/${id}/status`, null, { params: { status } }),
};
