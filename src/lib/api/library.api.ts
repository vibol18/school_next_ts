import { apiClient } from './client';
import type { Book, BookIssue } from '@/types/api.types';

// ── Books ──────────────────────────────────────────────
export const bookApi = {
  getAll: (): Promise<Book[]> =>
    apiClient.get('/api/library/books'),

  getById: (id: number): Promise<Book> =>
    apiClient.get(`/api/library/books/${id}`),

  search: (query: string): Promise<Book[]> =>
    apiClient.get('/api/library/books/search', { params: { query } }),

  create: (data: Omit<Book, 'id'>): Promise<Book> =>
    apiClient.post('/api/library/books', data),

  update: (id: number, data: Partial<Omit<Book, 'id'>>): Promise<Book> =>
    apiClient.put(`/api/library/books/${id}`, data),
};

// ── Book Issues ────────────────────────────────────────
export const bookIssueApi = {
  issue: (data: Pick<BookIssue, 'bookId' | 'studentId' | 'dueDate'>): Promise<BookIssue> =>
    apiClient.post('/api/library/transactions/issue', data),

  returnBook: (id: number): Promise<BookIssue> =>
    apiClient.post(`/api/library/transactions/${id}/return`),

  getByStudent: (studentId: number): Promise<BookIssue[]> =>
    apiClient.get(`/api/library/transactions/student/${studentId}`),

  getOverdue: (): Promise<BookIssue[]> =>
    apiClient.get('/api/library/transactions/overdue'),
};
