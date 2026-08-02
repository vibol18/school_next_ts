'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teacherSchema, TeacherFormData } from '@/lib/validators/teacher.schema';

interface TeacherFormProps {
  initialValues?: TeacherFormData;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  isLoading?: boolean;
  buttonText?: string;
}

const defaultValues: TeacherFormData = {
  employeeId: '',
  qualification: '',
  experienceYears: '',
  dateOfJoining: '',
};

export default function TeacherForm({
  initialValues,
  onSubmit,
  isLoading = false,
  buttonText = 'Save Teacher',
}: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialValues || defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
        <input
          {...register('employeeId')}
          type="text"
          placeholder="e.g. EMP-1002"
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
        <input
          {...register('qualification')}
          type="text"
          placeholder="e.g. M.Sc. Mathematics"
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
        <input
          {...register('experienceYears')}
          type="number"
          placeholder="e.g. 5"
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
        <input
          {...register('dateOfJoining')}
          type="date"
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 text-sm"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </form>
  );
}