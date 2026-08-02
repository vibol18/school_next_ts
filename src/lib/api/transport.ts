import { apiClient } from "./client";

export const transportApi = {
  getRoutes: async (params?: Record<string, any>) => await apiClient.get("/api/transport/routes", { params }),
  getRouteById: async (id: string | number) => await apiClient.get(`/api/transport/routes/${id}`),
  createRoute: async (data: any) => await apiClient.post("/api/transport/routes", data),
  updateRoute: async (id: string | number, data: any) => await apiClient.put(`/api/transport/routes/${id}`, data),
  deleteRoute: async (id: string | number) => await apiClient.delete(`/api/transport/routes/${id}`),

  getVehicles: async (params?: Record<string, any>) => await apiClient.get("/api/transport/vehicles", { params }),
  createVehicle: async (data: any) => await apiClient.post("/api/transport/vehicles", data),
  updateVehicle: async (id: string | number, data: any) => await apiClient.put(`/api/transport/vehicles/${id}`, data),
  deleteVehicle: async (id: string | number) => await apiClient.delete(`/api/transport/vehicles/${id}`),

  getAllocations: async (params?: Record<string, any>) => await apiClient.get("/api/transport/allocations", { params }),
  allocateStudent: async (data: any) => await apiClient.post("/api/transport/allocations", data),
  deallocateStudent: async (id: string | number) => await apiClient.delete(`/api/transport/allocations/${id}`),
};
