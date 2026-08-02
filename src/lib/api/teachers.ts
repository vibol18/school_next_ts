import { apiClient } from './client';
import { Teacher, TeacherCreateInput, TeacherUpdateInput, Subject, TimetableSlot } from '@/types/teacher.types';

const unwrapPayload = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined && payload.data !== null) {
    return payload.data as T;
  }
  return payload as T;
};

const normalizeList = <T>(payload: any): T[] => {
  const unwrapped = unwrapPayload<any>(payload);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && Array.isArray(unwrapped.data)) return unwrapped.data;
  if (unwrapped && Array.isArray(unwrapped.items)) return unwrapped.items;
  if (unwrapped && Array.isArray(unwrapped.content)) return unwrapped.content;
  return [];
};

export const teacherApi = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await apiClient.get('/api/teachers');
    return normalizeList<Teacher>(response);
  },

  getById: async (id: number): Promise<Teacher> => {
    const response = await apiClient.get(`/api/teachers/${id}`);
    return unwrapPayload<Teacher>(response);
  },

  create: async (payload: TeacherCreateInput): Promise<Teacher> => {
    const response = await apiClient.post('/api/teachers', payload);
    return unwrapPayload<Teacher>(response);
  },

  update: async (id: number, payload: TeacherUpdateInput): Promise<Teacher> => {
    const response = await apiClient.put(`/api/teachers/${id}`, payload);
    return unwrapPayload<Teacher>(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/teachers/${id}`);
  },

  getSubjects: async (id: number): Promise<Subject[]> => {
    const response = await apiClient.get(`/api/teachers/${id}/subjects`);
    return normalizeList<Subject>(response);
  },

  getTimetable: async (id: number): Promise<TimetableSlot[]> => {
    const response = await apiClient.get(`/api/teachers/${id}/timetable`);
    return normalizeList<TimetableSlot>(response);
  },
};