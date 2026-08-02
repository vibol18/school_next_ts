import { apiClient } from "./client";

export const libraryApi = {
  getBooks: async (params?: Record<string, any>) => await apiClient.get("/api/library/books", { params }),
  getBookById: async (id: string | number) => await apiClient.get(`/api/library/books/${id}`),
  createBook: async (data: any) => await apiClient.post("/api/library/books", data),
  updateBook: async (id: string | number, data: any) => await apiClient.put(`/api/library/books/${id}`, data),
  deleteBook: async (id: string | number) => await apiClient.delete(`/api/library/books/${id}`),
  
  getTransactions: async (params?: Record<string, any>) => await apiClient.get("/api/library/transactions", { params }),
  issueBook: async (data: any) => await apiClient.post("/api/library/transactions/issue", data),
  returnBook: async (id: string | number) => await apiClient.post(`/api/library/transactions/${id}/return`),
};
