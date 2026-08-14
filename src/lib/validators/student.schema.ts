import { z } from 'zod';

const profilePhotoField = z
  .union([
    z.string().startsWith('data:image/', 'Must be an image file'),
    z.string().url('Image URL is invalid'),
    z.string().length(0),
    z.null(),
  ])
  .optional();

export const studentCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  profilePhoto: profilePhotoField,
});

export type StudentCreateInput = z.infer<typeof studentCreateSchema>;

export const studentUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  profilePhoto: profilePhotoField,
});

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;