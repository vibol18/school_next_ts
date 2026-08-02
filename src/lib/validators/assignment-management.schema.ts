import { z } from 'zod';

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  fileUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  sectionId: z.number().optional(),
  subjectId: z.number().optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;
