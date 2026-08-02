import { apiClient } from './client';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './auth.types';

export const authApi = {
  // POST /api/auth/register
  register: (data: RegisterRequest): Promise<ApiResponse<null>> => {
    return apiClient.post('/api/auth/register', data);
  },

  // POST /api/auth/login
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/api/auth/login', data);
  },

  // POST /api/auth/refresh-token
  refreshToken: (data: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/api/auth/refresh-token', data);
  },

  // POST /api/auth/logout
  logout: (): Promise<ApiResponse<null>> => {
    return apiClient.post('/api/auth/logout');
  },

  // POST /api/auth/forgot-password
  forgotPassword: (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    return apiClient.post('/api/auth/forgot-password', data);
  },

  // POST /api/auth/reset-password
  resetPassword: (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    return apiClient.post('/api/auth/reset-password', data);
  },
};