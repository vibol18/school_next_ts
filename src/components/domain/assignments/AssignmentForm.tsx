'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sectionsApi, subjectsApi } from '@/lib/api/academic';
import type { Section, Subject } from '@/types/school.types';

const toDateOnly = (value?: string) => (value ? value.slice(0, 10) : value);

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  fileUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  sectionId: z.coerce.number().min(1, 'Please select a section'),
  subjectId: z.coerce.number().min(1, 'Please select a subject'),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export default function AssignmentForm({
  initialValues = undefined,
  onSubmit,
  isLoading = false,
  buttonText = 'Save Assignment',
}: {
  initialValues?: {
    title?: string;
    description?: string;
    dueDate?: string;
    fileUrl?: string;
    sectionId?: number;
    subjectId?: number;
  };
  onSubmit: (data: AssignmentFormValues) => void;
  isLoading?: boolean;
  buttonText?: string;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sectionData, subjectData] = await Promise.all([
          sectionsApi.getAll(),
          subjectsApi.getAll(),
        ]);
        setSections(sectionData);
        setSubjects(subjectData);
      } catch (err: any) {
        setMetaError(err?.message || 'Failed to load sections and subjects.');
      } finally {
        setMetaLoading(false);
      }
    })();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      dueDate: toDateOnly(initialValues?.dueDate) || '',
      fileUrl: initialValues?.fileUrl || '',
      sectionId: initialValues?.sectionId || undefined,
      subjectId: initialValues?.subjectId || undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
      {metaError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {metaError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g. Midterm Physics Project"
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm"
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Detailed instructions for students..."
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm"
        />
        {errors.description && (
          <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
          {metaLoading ? (
            <div className="px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-400">
              Loading sections...
            </div>
          ) : (
            <select
              {...register('sectionId')}
              className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm bg-white"
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {errors.sectionId && (
            <p className="text-rose-500 text-xs mt-1">{errors.sectionId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          {metaLoading ? (
            <div className="px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-400">
              Loading subjects...
            </div>
          ) : (
            <select
              {...register('subjectId')}
              className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm bg-white"
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          {errors.subjectId && (
            <p className="text-rose-500 text-xs mt-1">{errors.subjectId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
        <input
          {...register('dueDate')}
          type="date"
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm"
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
          className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] text-sm"
        />
        {errors.fileUrl && <p className="text-rose-500 text-xs mt-1">{errors.fileUrl.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading || metaLoading}
        className="w-full bg-[#5b51ef] hover:bg-[#4b42db] text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50 text-sm"
      >
        {isLoading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
}
