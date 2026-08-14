import { apiClient } from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
} from './auth.types';

// Auth endpoints return raw bodies (no ApiResponse envelope).
// The client.ts interceptor already unwraps response.data, so these
// resolve directly to the backend DTOs.
export const authApi = {
  // POST /api/auth/register
  register: (data: RegisterRequest): Promise<MessageResponse> => {
    return apiClient.post('/api/auth/register', data);
  },

  // POST /api/auth/login
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('/api/auth/login', data);
  },

  // POST /api/auth/refresh-token
  refreshToken: (data: RefreshTokenRequest): Promise<LoginResponse> => {
    return apiClient.post('/api/auth/refresh-token', data);
  },

  // POST /api/auth/logout
  logout: (): Promise<MessageResponse> => {
    return apiClient.post('/api/auth/logout');
  },

  // POST /api/auth/forgot-password
  forgotPassword: (data: ForgotPasswordRequest): Promise<MessageResponse> => {
    return apiClient.post('/api/auth/forgot-password', data);
  },

  // POST /api/auth/reset-password
  resetPassword: (data: ResetPasswordRequest): Promise<MessageResponse> => {
    return apiClient.post('/api/auth/reset-password', data);
  },
};
