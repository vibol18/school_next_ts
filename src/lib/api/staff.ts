import { apiClient } from "./client";

export const staffApi = {
  getAll: async (params?: Record<string, any>) => await apiClient.get("/api/staff", { params }),
  getById: async (id: string | number) => await apiClient.get(`/api/staff/${id}`),
  create: async (data: any) => await apiClient.post("/api/staff", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/staff/${id}`, data),
  delete: async (id: string | number) => await apiClient.delete(`/api/staff/${id}`),
};
