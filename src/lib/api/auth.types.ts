// DTOs matching the backend (com.example.real_school.auth.dto.*)
import { Role } from '@/lib/utils/roles';

export interface RegisterRequest {
  username: string;
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

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  profilePhoto?: string | null;
}

// Matches com.example.real_school.auth.dto.LoginResponse (raw body, no envelope)
export interface LoginResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
  user: AuthUser;
}

// Matches com.example.real_school.auth.controller.AuthController message responses
export interface MessageResponse {
  message: string;
}
