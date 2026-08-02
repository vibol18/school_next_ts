import { apiClient } from "./client";

export const communicationApi = {
  getMessages: async (params?: Record<string, any>) => await apiClient.get("/api/communication/messages", { params }),
  sendMessage: async (data: any) => await apiClient.post("/api/communication/messages", data),
  getNotices: async (params?: Record<string, any>) => await apiClient.get("/api/communication/notices", { params }),
  createNotice: async (data: any) => await apiClient.post("/api/communication/notices", data),
  getEvents: async (params?: Record<string, any>) => await apiClient.get("/api/communication/events", { params }),
  createEvent: async (data: any) => await apiClient.post("/api/communication/events", data),
};
