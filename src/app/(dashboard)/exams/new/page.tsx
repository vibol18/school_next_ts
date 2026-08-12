'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examApi } from '@/lib/api/exam.api'; // Adjust path to your API file
import type { Exam } from '@/types/school.types';
import {
  FilePlus,
  ArrowLeft,
  Calendar,
  BookOpen,
  Award,
  Layers,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function NewExamPage() {
  const router = Router();
  const queryClient = useQueryClient();

  // Form State
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<Exam['examType']>('MIDTERM');
  const [academicYearId, setAcademicYearId] = useState<number | ''>('');
  const [classId, setClassId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutation to create new exam
  const createExamMutation = useMutation({
    mutationFn: (newExam: Omit<Exam, 'id'>) => examApi.create(newExam),
    onSuccess: () => {
      // Invalidate exams query to refetch updated lists across the app
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

    // Basic Validation
    if (!title.trim()) {
      setErrorMessage('Exam title is required.');
      return;
    }
    if (!academicYearId) {
      setErrorMessage('Please select or enter a valid Academic Year ID.');
      return;
    }
    if (!classId) {
      setErrorMessage('Please select or enter a valid Class ID.');
      return;
    }

    createExamMutation.mutate({
      title,
      examType,
      academicYearId: Number(academicYearId),
      classId: Number(classId),
      startDate,
      endDate,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Top Header & Back Button */}
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
              Set up term tests, midterms, or final examinations for classes.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert Bar */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Exam Overview
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Midterm Examination Term 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef] focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as Exam['examType'])}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                  >
                    <option value="MIDTERM">MIDTERM</option>
                    <option value="FINAL">FINAL</option>
                    <option value="FORMATIVE">FORMATIVE</option>
                    <option value="SUMMATIVE">SUMMATIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Academic Year ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1"
                    value={academicYearId}
                    onChange={(e) =>
                      setAcademicYearId(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Class ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={classId}
                    onChange={(e) =>
                      setClassId(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Dates */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              2. Schedule Duration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>
            </div>
          </div>

          {/* Form Controls */}
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