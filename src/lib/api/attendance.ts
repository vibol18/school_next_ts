import { apiClient } from "./client";

export const attendanceApi = {
  getAll: async (params?: Record<string, any>) => await apiClient.get("/api/attendance", { params }),
  getById: async (id: string | number) => await apiClient.get(`/api/attendance/${id}`),
  getByStudent: async (studentId: string | number) => await apiClient.get(`/api/attendance/student/${studentId}`),
  getByClass: async (classId: string | number, date?: string) => await apiClient.get(`/api/attendance/class/${classId}`, { params: { date } }),
  markAttendance: async (data: any) => await apiClient.post("/api/attendance", data),
  updateAttendance: async (id: string | number, data: any) => await apiClient.put(`/api/attendance/${id}`, data),
};
