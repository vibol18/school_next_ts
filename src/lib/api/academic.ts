import { apiClient } from "./client";

// Classes
export const classesApi = {
  getAll: async () => await apiClient.get("/api/classes"),
  getById: async (id: string | number) => await apiClient.get(`/api/classes/${id}`),
  getSubjects: async (classId: string | number) => await apiClient.get(`/api/classes/${classId}/subjects`),
  getSections: async (classId: string | number) => await apiClient.get(`/api/classes/${classId}/sections`),
  create: async (data: any) => await apiClient.post("/api/classes", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/classes/${id}`, data),
  delete: async (id: string | number) => await apiClient.delete(`/api/classes/${id}`),
};


export const sectionsApi = {
  getAll: async () => await apiClient.get("/api/sections"),
  getById: async (id: string | number) => await apiClient.get(`/api/sections/${id}`),
  create: async (data: any) => await apiClient.post("/api/sections", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/sections/${id}`, data),
  delete: async (id: string | number) => await apiClient.delete(`/api/sections/${id}`),
};


export const subjectsApi = {
  getAll: async () => await apiClient.get("/api/subjects"),
  getById: async (id: string | number) => await apiClient.get(`/api/subjects/${id}`),
  create: async (data: any) => await apiClient.post("/api/subjects", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/subjects/${id}`, data),
  delete: async (id: string | number) => await apiClient.delete(`/api/subjects/${id}`),
};


export const academicYearsApi = {
  getAll: async () => await apiClient.get("/api/academic-years"),
  getById: async (id: string | number) => await apiClient.get(`/api/academic-years/${id}`),
  create: async (data: any) => await apiClient.post("/api/academic-years", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/academic-years/${id}`, data),
  setCurrent: async (id: string | number) => await apiClient.patch(`/api/academic-years/${id}/set-current`),
};

export const classSubjectTeacherApi = {
  create: async (data: { classId: number; subjectId: number; teacherId: number; sectionId: number }) =>
    await apiClient.post("/api/class-subject-teacher", data),
  getBySection: async (sectionId: string | number) =>
    await apiClient.get(`/api/class-subject-teacher/section/${sectionId}`),
  delete: async (id: string | number) =>
    await apiClient.delete(`/api/class-subject-teacher/${id}`),
};