import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api.types';

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/api/auth/login', data),

  register: (data: RegisterRequest): Promise<void> =>
    apiClient.post('/api/auth/register', data),

  logout: (): Promise<void> =>
    apiClient.post('/api/auth/logout'),

  refreshToken: (refreshToken: string): Promise<{ token: string }> =>
    apiClient.post('/api/auth/refresh-token', { refreshToken }),

  forgotPassword: (email: string): Promise<void> =>
    apiClient.post('/api/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; newPassword: string }): Promise<void> =>
    apiClient.post('/api/auth/reset-password', data),
};
