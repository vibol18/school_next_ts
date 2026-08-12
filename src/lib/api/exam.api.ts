import { apiClient } from './client';
import type { Exam, ExamResult } from '@/types/api.types';

// ── Exams ──────────────────────────────────────────────
export const examApi = {
  getAll: (): Promise<Exam[]> =>
    apiClient.get('/api/exams'),

  getById: (id: number): Promise<Exam> =>
    apiClient.get(`/api/exams/${id}`),

  create: (data: Omit<Exam, 'id'>): Promise<Exam> =>
    apiClient.post('/api/exams', data),

  update: (id: number, data: Partial<Omit<Exam, 'id'>>): Promise<Exam> =>
    apiClient.put(`/api/exams/${id}`, data),
};

// ── Exam Schedules ──────────────────────────────────────
export const examScheduleApi = {
  getByExam: (examId: number): Promise<unknown[]> =>
    apiClient.get(`/api/exam-schedule/exam/${examId}`),

  create: (data: unknown): Promise<unknown> =>
    apiClient.post('/api/exam-schedule', data),

  update: (id: number, data: unknown): Promise<unknown> =>
    apiClient.put(`/api/exam-schedule/${id}`, data),
};

// ── Exam Results ───────────────────────────────────────
export const examResultApi = {
  create: (data: Omit<ExamResult, 'id'>): Promise<ExamResult> =>
    apiClient.post('/api/exam-results', data),

  update: (id: number, data: Partial<Omit<ExamResult, 'id'>>): Promise<ExamResult> =>
    apiClient.put(`/api/exam-results/${id}`, data),

  getByStudent: (studentId: number): Promise<ExamResult[]> =>
    apiClient.get(`/api/exam-results/student/${studentId}`),

  getByExamAndSubject: (examId: number, subjectId: number): Promise<ExamResult[]> =>
    apiClient.get(`/api/exam-results/exam/${examId}/subject/${subjectId}`),
};
