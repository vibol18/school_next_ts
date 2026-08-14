import { apiClient } from './client';

// Matches com.example.real_school.school.dto.SchoolInfoDto
export interface SchoolInfo {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
}

export interface SchoolInfoUpdateRequest {
  name: string;
  phone?: string;
  address?: string;
}

export const schoolInfoApi = {
  // GET /api/school/info
  getInfo: (): Promise<SchoolInfo> => {
    return apiClient.get('/api/school/info');
  },

  // PUT /api/school/info (admin only)
  updateInfo: (data: SchoolInfoUpdateRequest): Promise<SchoolInfo> => {
    return apiClient.put('/api/school/info', data);
  },
};
