'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  fileUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  sectionId: z.number().optional(),
  subjectId: z.number().optional(),
});

export default function AssignmentForm({
  initialValues = undefined,
  onSubmit,
  isLoading = false,
  buttonText = 'Save Assignment',
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      dueDate: initialValues?.dueDate || '',
      fileUrl: initialValues?.fileUrl || '',
      sectionId: initialValues?.sectionId || undefined,
      subjectId: initialValues?.subjectId || undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g. Midterm Physics Project"
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Detailed instructions for students..."
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.description && (
          <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Section ID</label>
          <input
            {...register('sectionId', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 101"
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.sectionId && (
            <p className="text-rose-500 text-xs mt-1">{errors.sectionId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject ID</label>
          <input
            {...register('subjectId', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 12"
            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.subjectId && (
            <p className="text-rose-500 text-xs mt-1">{errors.subjectId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
        <input
          {...register('dueDate')}
          type="datetime-local"
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.dueDate && <p className="text-rose-500 text-xs mt-1">{errors.dueDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Attachment/File URL (Optional)
        </label>
        <input
          {...register('fileUrl')}
          type="url"
          placeholder="https://drive.google.com/..."
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.fileUrl && <p className="text-rose-500 text-xs mt-1">{errors.fileUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#5b51ef] hover:bg-[#4b41df] text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 text-sm"
      >
        {isLoading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
}