export interface ApiResponse<T> { data: T; }
export interface PageResponse<T> { items: T[]; total: number; }
// auth.types.ts
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string; // e.g. "ADMIN", "TEACHER", "STUDENT"
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}