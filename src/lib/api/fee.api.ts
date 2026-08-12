import { apiClient } from './client';
import type { FeeCategory, Payment } from '@/types/api.types';

// ── Fee Categories ─────────────────────────────────────
export const feeCategoryApi = {
  getAll: (): Promise<FeeCategory[]> =>
    apiClient.get('/api/fee-categories'),

  create: (data: Omit<FeeCategory, 'id'>): Promise<FeeCategory> =>
    apiClient.post('/api/fee-categories', data),

  update: (id: number, data: Partial<Omit<FeeCategory, 'id'>>): Promise<FeeCategory> =>
    apiClient.put(`/api/fee-categories/${id}`, data),
};

// ── Payments ───────────────────────────────────────────
export const paymentApi = {
  create: (data: Omit<Payment, 'id' | 'paidAt'>): Promise<Payment> =>
    apiClient.post('/api/fee-payments', data),

  getById: (id: number): Promise<Payment> =>
    apiClient.get(`/api/fee-payments/${id}`),

  getByStudent: (studentId: number): Promise<Payment[]> =>
    apiClient.get(`/api/fee-payments/student/${studentId}`),

  getPending: (): Promise<Payment[]> =>
    apiClient.get('/api/fee-payments/pending'),

  getReceiptPdf: (id: number): Promise<Blob> =>
    apiClient.get(`/api/fee-payments/${id}/receipt-pdf`, { responseType: 'blob' }),
};
