import { apiClient } from './client';
import {
  AssignmentSubmission,
  CreateSubmissionInput,
  GradeSubmissionQueryParams,
} from '@/types/assignment.types';

export const assignmentSubmissionApi = {
  // POST /api/assignment-submissions
  submit: async (data: CreateSubmissionInput): Promise<AssignmentSubmission> => {
    const response = await apiClient.post<AssignmentSubmission>('/api/assignment-submissions', data);
    return response.data;
  },

  // PATCH /api/assignment-submissions/{id}/grade?marks={marks}&feedback={feedback}
  grade: async (
    id: number,
    params: GradeSubmissionQueryParams
  ): Promise<AssignmentSubmission> => {
    const response = await apiClient.patch<AssignmentSubmission>(
      `/api/assignment-submissions/${id}/grade`,
      null,
      { params }
    );
    return response.data;
  },

  // GET /api/assignment-submissions/student/{studentId}
  getByStudent: async (studentId: number): Promise<AssignmentSubmission[]> => {
    const response = await apiClient.get<AssignmentSubmission[]>(
      `/api/assignment-submissions/student/${studentId}`
    );
    return response.data;
  },

  // GET /api/assignment-submissions/assignment/{assignmentId}
  getByAssignment: async (assignmentId: number): Promise<AssignmentSubmission[]> => {
    const response = await apiClient.get<AssignmentSubmission[]>(
      `/api/assignment-submissions/assignment/${assignmentId}`
    );
    return response.data;
  },
};