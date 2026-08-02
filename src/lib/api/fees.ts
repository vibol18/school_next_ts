import { apiClient } from "./client";

export const feesApi = {
  getInvoices: async (params?: Record<string, any>) => await apiClient.get("/api/fees/invoices", { params }),
  getInvoiceById: async (id: string | number) => await apiClient.get(`/api/fees/invoices/${id}`),
  generateInvoice: async (data: any) => await apiClient.post("/api/fees/invoices", data),
  
  getPayments: async (params?: Record<string, any>) => await apiClient.get("/api/fees/payments", { params }),
  getPaymentById: async (id: string | number) => await apiClient.get(`/api/fees/payments/${id}`),
  recordPayment: async (data: any) => await apiClient.post("/api/fees/payments", data),
  
  getFeeTypes: async () => await apiClient.get("/api/fees/types"),
  createFeeType: async (data: any) => await apiClient.post("/api/fees/types", data),
};
