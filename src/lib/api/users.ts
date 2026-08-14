import { apiClient } from "./client";
import type { UserRecipient } from "@/types/api.types";

export const usersApi = {
  getAll: async (params?: Record<string, any>) => {
    const res = await apiClient.get("/api/users", { params });
    return res;
  },
  getRecipients: async (): Promise<UserRecipient[]> => {
    return apiClient.get("/api/users/recipients");
  },
  getById: async (id: string | number) => {
    const res = await apiClient.get(`/api/users/${id}`);
    return res;
  },
  update: async (id: string | number, data: any) => {
    const res = await apiClient.put(`/api/users/${id}`, data);
    return res;
  },
  delete: async (id: string | number) => {
    const res = await apiClient.delete(`/api/users/${id}`);
    return res;
  },
  updateStatus: async (id: string | number, status: string) => {
    const res = await apiClient.patch(`/api/users/${id}/status`, { status });
    return res;
  },
};