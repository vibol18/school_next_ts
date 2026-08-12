import { apiClient } from './client';
import type {
  AcademicYear,
  SchoolClass as Class,
  Section,
  Subject,
  Enrollment,
} from '@/types/school.types';

// ── Academic Years ─────────────────────────────────────
export const academicYearApi = {
  getAll: (): Promise<AcademicYear[]> =>
    apiClient.get('/api/academic-years'),

  getById: (id: number): Promise<AcademicYear> =>
    apiClient.get(`/api/academic-years/${id}`),

  create: (data: Omit<AcademicYear, 'id'>): Promise<AcademicYear> =>
    apiClient.post('/api/academic-years', data),

  update: (id: number, data: Partial<Omit<AcademicYear, 'id'>>): Promise<AcademicYear> =>
    apiClient.put(`/api/academic-years/${id}`, data),

  setCurrent: (id: number): Promise<AcademicYear> =>
    apiClient.patch(`/api/academic-years/${id}/set-current`),
};

// ── Classes ────────────────────────────────────────────
export const classApi = {
  getAll: (): Promise<Class[]> =>
    apiClient.get('/api/classes'),

  getById: (id: number): Promise<Class> =>
    apiClient.get(`/api/classes/${id}`),

  create: (data: Omit<Class, 'id'>): Promise<Class> =>
    apiClient.post('/api/classes', data),

  update: (id: number, data: Partial<Omit<Class, 'id'>>): Promise<Class> =>
    apiClient.put(`/api/classes/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/classes/${id}`),

  getSubjects: (classId: number): Promise<Subject[]> =>
    apiClient.get(`/api/classes/${classId}/subjects`),

  getSections: (classId: number): Promise<Section[]> =>
    apiClient.get(`/api/classes/${classId}/sections`),
};

export const sectionApi = {
  getAll: (): Promise<Section[]> =>
    apiClient.get('/api/sections'),

  getById: (id: number): Promise<Section> =>
    apiClient.get(`/api/sections/${id}`),

  create: (data: Omit<Section, 'id'>): Promise<Section> =>
    apiClient.post('/api/sections', data),

  update: (id: number, data: Partial<Omit<Section, 'id'>>): Promise<Section> =>
    apiClient.put(`/api/sections/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/sections/${id}`),
};

// ── Subjects ───────────────────────────────────────────
export const subjectApi = {
  getAll: (): Promise<Subject[]> =>
    apiClient.get('/api/subjects'),

  getById: (id: number): Promise<Subject> =>
    apiClient.get(`/api/subjects/${id}`),

  create: (data: Omit<Subject, 'id'>): Promise<Subject> =>
    apiClient.post('/api/subjects', data),

  update: (id: number, data: Partial<Omit<Subject, 'id'>>): Promise<Subject> =>
    apiClient.put(`/api/subjects/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/subjects/${id}`),
};

// ── Enrollments ────────────────────────────────────────
export const enrollmentApi = {
  getAll: (): Promise<Enrollment[]> =>
    apiClient.get('/api/enrollments'),

  getById: (id: number): Promise<Enrollment> =>
    apiClient.get(`/api/enrollments/${id}`),

  getByStudent: (studentId: number): Promise<Enrollment[]> =>
    apiClient.get(`/api/enrollments/student/${studentId}`),

  create: (data: Omit<Enrollment, 'id'>): Promise<Enrollment> =>
    apiClient.post('/api/enrollments', data),

  update: (id: number, data: Partial<Omit<Enrollment, 'id'>>): Promise<Enrollment> =>
    apiClient.put(`/api/enrollments/${id}`, data),
};
