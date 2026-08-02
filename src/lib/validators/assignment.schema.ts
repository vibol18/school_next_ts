import { z } from 'zod';

export const submissionSchema = z.object({
  assignmentId: z.number().positive('Assignment ID is required'),
  studentId: z.number().positive('Student ID is required'),
  fileUrl: z.string().url('Please enter a valid file URL (e.g. drive/cloud link)'),
});

export const gradeSchema = z.object({
  marks: z
    .number({ invalid_type_error: 'Marks must be a valid number' })
    .min(0, 'Marks cannot be negative'),
  feedback: z.string().optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
export type GradeFormData = z.infer<typeof gradeSchema>;