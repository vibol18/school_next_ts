import { apiClient } from './client';
import type { HostelBlock, HostelRoom, HostelAllocation } from '@/types/api.types';

// ── Hostel Blocks ──────────────────────────────────────
export const hostelBlockApi = {
  getAll: (): Promise<HostelBlock[]> =>
    apiClient.get('/api/hostels/blocks'),

  create: (data: Omit<HostelBlock, 'id'>): Promise<HostelBlock> =>
    apiClient.post('/api/hostels/blocks', data),
};

// ── Hostel Rooms ───────────────────────────────────────
export const hostelRoomApi = {
  getByBlock: (blockId: number): Promise<HostelRoom[]> =>
    apiClient.get(`/api/hostels/blocks/${blockId}/rooms`),

  create: (data: Omit<HostelRoom, 'id' | 'occupied'>): Promise<HostelRoom> =>
    apiClient.post('/api/hostels/rooms', data),
};

// ── Hostel Allocations ─────────────────────────────────
export const hostelAllocationApi = {
  create: (data: Pick<HostelAllocation, 'roomId' | 'studentId' | 'allocationDate'>): Promise<HostelAllocation> =>
    apiClient.post('/api/hostels/allocations', data),

  vacate: (id: number): Promise<HostelAllocation> =>
    apiClient.patch(`/api/hostels/allocations/${id}/vacate`),

  getByStudent: (studentId: number): Promise<HostelAllocation[]> =>
    apiClient.get(`/api/hostels/allocations/student/${studentId}`),
};
