import { apiClient } from './client';
import {
  AssignmentSubmission,
  CreateSubmissionInput,
  GradeSubmissionQueryParams,
} from '@/types/assignment.types';

export const assignmentSubmissionApi = {
  // POST /api/assignment-submissions
  submit: (data: CreateSubmissionInput): Promise<AssignmentSubmission> =>
    apiClient.post('/api/assignment-submissions', data),

  // PATCH /api/assignment-submissions/{id}/grade?marks={marks}&feedback={feedback}
  grade: (
    id: number,
    params: GradeSubmissionQueryParams
  ): Promise<AssignmentSubmission> =>
    apiClient.patch(`/api/assignment-submissions/${id}/grade`, null, { params }),

  // GET /api/assignment-submissions/student/{studentId}
  getByStudent: (studentId: number): Promise<AssignmentSubmission[]> =>
    apiClient.get(`/api/assignment-submissions/student/${studentId}`),

  // GET /api/assignment-submissions/assignment/{assignmentId}
  getByAssignment: (assignmentId: number): Promise<AssignmentSubmission[]> =>
    apiClient.get(`/api/assignment-submissions/assignment/${assignmentId}`),
};
