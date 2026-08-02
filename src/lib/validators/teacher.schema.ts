import { z } from 'zod';

export const teacherSchema = z.object({
  employeeId: z
    .string()
    .min(2, 'Employee ID must be at least 2 characters')
    .max(20, 'Employee ID cannot exceed 20 characters'),
  qualification: z
    .string()
    .min(2, 'Qualification is required'),
  experienceYears: z
    .string()
    .regex(/^\d+$/, 'Experience must be a positive number or zero'),
  dateOfJoining: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid joining date',
    }),
});

export type TeacherFormData = z.infer<typeof teacherSchema>;