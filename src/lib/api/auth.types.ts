// Matches com.example.real_school.common.dto.ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// DTOs matching your backend
import { Role } from '@/lib/utils/roles';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Matches com.example.real_school.auth.dto.LoginResponse
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}