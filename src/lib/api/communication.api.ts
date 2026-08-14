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
  getInbox: (userId: number): Promise<Message[]> =>
    apiClient.get(`/api/messages/inbox/${userId}`),

  getSent: (userId: number): Promise<Message[]> =>
    apiClient.get(`/api/messages/sent/${userId}`),

  getConversation: (userId: number, otherUserId: number): Promise<Message[]> =>
    apiClient.get(`/api/messages/conversation/${userId}/${otherUserId}`),

  getUnreadCount: (userId: number): Promise<number> =>
    apiClient.get(`/api/messages/unread-count/${userId}`),

  send: (data: { receiverId: number; subject: string; body: string }): Promise<Message> =>
    apiClient.post('/api/messages/send', data),

  markAsRead: (id: number): Promise<Message> =>
    apiClient.patch(`/api/messages/${id}/read`),

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
