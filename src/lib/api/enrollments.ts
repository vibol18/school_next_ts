import { apiClient } from "./client";

export const enrollmentsApi = {
  getAll: async () => await apiClient.get("/api/enrollments"),
  getByStudent: async (studentId: string | number) => await apiClient.get(`/api/enrollments/student/${studentId}`),
  create: async (data: any) => await apiClient.post("/api/enrollments", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/enrollments/${id}`, data),
};