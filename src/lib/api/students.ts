import { apiClient } from "./client";

const unwrapPayload = (payload: any) => {
  if (payload && typeof payload === 'object' && payload.data !== undefined && payload.data !== null) {
    return payload.data;
  }
  return payload;
};

const normalizeStudentList = (payload: any) => {
  const unwrapped = unwrapPayload(payload);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && Array.isArray(unwrapped.data)) return unwrapped.data;
  if (unwrapped && Array.isArray(unwrapped.items)) return unwrapped.items;
  if (unwrapped && Array.isArray(unwrapped.content)) return unwrapped.content;
  return [];
};

export const studentsApi = {
  getAll: async (params?: Record<string, any>) => {
    const res = await apiClient.get<any>("/api/students", { params });
    return normalizeStudentList(res);
  },
  getById: async (id: string | number) => {
    const res = await apiClient.get<any>(`/api/students/${id}`);
    return unwrapPayload(res);
  },
  getFullProfile: async (id: string | number) => {
    const res = await apiClient.get<any>(`/api/students/${id}/full-profile`);
    return unwrapPayload(res);
  },
  getBySection: async (sectionId: string | number) => {
    const res = await apiClient.get<any>(`/api/students/section/${sectionId}`);
    return normalizeStudentList(res);
  },
  create: async (data: any) => {
    const res = await apiClient.post<any>("/api/students", data);
    return unwrapPayload(res);
  },
  update: async (id: string | number, data: any) => {
    const res = await apiClient.put<any>(`/api/students/${id}`, data);
    return unwrapPayload(res);
  },
  delete: async (id: string | number) => {
    const res = await apiClient.delete<any>(`/api/students/${id}`);
    return unwrapPayload(res);
  },
  linkParent: async (studentId: string | number, parentId: string | number) => {
    const res = await apiClient.post<any>(`/api/students/${studentId}/parents/${parentId}`);
    return unwrapPayload(res);
  },
};