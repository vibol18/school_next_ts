import { apiClient } from "./client";

export const hostelApi = {
  getRooms: async (params?: Record<string, any>) => await apiClient.get("/api/hostel/rooms", { params }),
  getRoomById: async (id: string | number) => await apiClient.get(`/api/hostel/rooms/${id}`),
  createRoom: async (data: any) => await apiClient.post("/api/hostel/rooms", data),
  updateRoom: async (id: string | number, data: any) => await apiClient.put(`/api/hostel/rooms/${id}`, data),
  deleteRoom: async (id: string | number) => await apiClient.delete(`/api/hostel/rooms/${id}`),

  getAllocations: async (params?: Record<string, any>) => await apiClient.get("/api/hostel/allocations", { params }),
  allocateRoom: async (data: any) => await apiClient.post("/api/hostel/allocations", data),
  deallocateRoom: async (id: string | number) => await apiClient.post(`/api/hostel/allocations/${id}/deallocate`),
};
