import { apiClient } from './client';
import type { Attendance, AttendanceSummary } from '@/types/api.types';

export const attendanceApi = {
  mark: (data: Omit<Attendance, 'id'>): Promise<Attendance> =>
    apiClient.post('/api/attendance', data),

  update: (id: number, data: Partial<Omit<Attendance, 'id'>>): Promise<Attendance> =>
    apiClient.put(`/api/attendance/${id}`, data),

  getByStudent: (studentId: number): Promise<Attendance[]> =>
    apiClient.get(`/api/attendance/student/${studentId}`),

  getBySection: (sectionId: number, date?: string): Promise<Attendance[]> =>
    apiClient.get(`/api/attendance/section/${sectionId}`, {
      params: date ? { date } : undefined,
    }),

  getSummary: (studentId: number): Promise<AttendanceSummary> =>
    apiClient.get(`/api/attendance/student/${studentId}/summary`),
};
