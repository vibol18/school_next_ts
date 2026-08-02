import { apiClient } from "./client";

export const examsApi = {
  getAll: async (params?: Record<string, any>) => await apiClient.get("/api/exams", { params }),
  getById: async (id: string | number) => await apiClient.get(`/api/exams/${id}`),
  create: async (data: any) => await apiClient.post("/api/exams", data),
  update: async (id: string | number, data: any) => await apiClient.put(`/api/exams/${id}`, data),
  getResults: async (examId: string | number) => await apiClient.get(`/api/exams/${examId}/results`),
  addResult: async (examId: string | number, data: any) => await apiClient.post(`/api/exams/${examId}/results`, data),
  updateResult: async (examId: string | number, resultId: string | number, data: any) => await apiClient.put(`/api/exams/${examId}/results/${resultId}`, data),
};
