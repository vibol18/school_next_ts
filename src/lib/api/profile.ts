import { apiClient } from './client';

// Matches com.example.real_school.user.dto.ProfileDto
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  profilePhoto: string | null;
}

export interface ProfileUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string | null;
}

export const profileApi = {
  // GET /api/profile/me
  getMe: (): Promise<UserProfile> => {
    return apiClient.get('/api/profile/me');
  },

  // PUT /api/profile/me
  updateMe: (data: ProfileUpdateRequest): Promise<UserProfile> => {
    return apiClient.put('/api/profile/me', data);
  },
};
