import { apiClient } from './client';
import type { DashboardStats } from '@/types/dashboard.types';

export const dashboardApi = {
  // GET /api/dashboard/stats
  getStats: (): Promise<DashboardStats> => {
    return apiClient.get('/api/dashboard/stats');
  },
};
