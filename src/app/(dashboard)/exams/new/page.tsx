'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from '@/lib/api/exam.api';
import { academicYearApi } from '@/lib/api/academic.api';
import type { Exam, AcademicYear } from '@/types/school.types';
import {
  FilePlus,
  ArrowLeft,
  Calendar,
  BookOpen,
  Award,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function NewExamPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [term, setTerm] = useState('');
  const [academicYearId, setAcademicYearId] = useState<number | ''>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: academicYears = [] } = useQuery<AcademicYear[]>({
    queryKey: ['academic-years'],
    queryFn: () => academicYearApi.getAll(),
  });

  const createExamMutation = useMutation({
    mutationFn: (newExam: Omit<Exam, 'id'>) => examApi.create(newExam),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      router.push('/exams');
    },
    onError: (error: Error) => {
      setErrorMessage(
        error.message || 'Failed to create exam. Please check your network or inputs.'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Exam name is required.');
      return;
    }
    if (!term.trim()) {
      setErrorMessage('Please enter the term, e.g. Term 1.');
      return;
    }
    if (!academicYearId) {
      setErrorMessage('Please select an Academic Year.');
      return;
    }

    createExamMutation.mutate({
      name: name.trim(),
      term: term.trim(),
      academicYearId: Number(academicYearId),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <FilePlus className="w-6 h-6 text-[#5b51ef]" />
              Create New Exam
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Set up term tests, midterms, or final examinations.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Exam Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Exam Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Examinations"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Term <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    required
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                  >
                    <option value="">Select term...</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    required
                    value={academicYearId}
                    onChange={(e) =>
                      setAcademicYearId(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                  >
                    <option value="">Select year...</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.yearName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createExamMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#5b51ef] text-white text-xs font-semibold rounded-xl hover:bg-[#4b42db] transition shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createExamMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Exam...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Exam</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
