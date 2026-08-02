export interface Assignment {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  fileUrl?: string;
  sectionId?: number;
  subjectId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentCreateInput {
  title: string;
  description?: string;
  dueDate?: string;
  fileUrl?: string;
  sectionId?: number;
  subjectId?: number;
}

export interface AssignmentUpdateInput {
  title?: string;
  description?: string;
  dueDate?: string;
  fileUrl?: string;
  sectionId?: number;
  subjectId?: number;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
  status: string;
}

export interface CreateSubmissionInput {
  assignmentId: number;
  studentId: number;
  fileUrl: string;
}

export interface GradeSubmissionQueryParams {
  marks: number;
  feedback?: string;
}