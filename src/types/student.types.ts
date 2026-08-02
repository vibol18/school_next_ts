export interface ParentDto {
  id: number;
  occupation?: string;
  contactNumber?: string;
  address?: string;
}

export interface StudentDto {
  id: number;
  admissionNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface StudentFullProfileDto {
  id: number;
  admissionNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  userId?: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  parents?: ParentDto[];
}

export interface StudentCreateRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
}