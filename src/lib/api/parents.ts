import { apiClient } from "./client";

export const parentsApi = {
  getAll: async (params?: Record<string, any>) => await apiClient.get("/api/parents", { params }),
  getById: async (id: string | number) => await apiClient.get(`/api/parents/${id}`),
  create: async (data: any) => await apiClient.post("/api/parents", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/parents/${id}`, data),
  getChildren: async (id: string | number) => await apiClient.get(`/api/parents/${id}/children`),
};
