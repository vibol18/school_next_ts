'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { examApi } from '@/lib/api/exam.api';
import { academicYearApi } from '@/lib/api/academic.api';
import type { Exam, AcademicYear } from '@/types/school.types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  GraduationCap,
  ListOrdered,
  Percent,
} from 'lucide-react';

export default function ExamDetailsPage() {
  const params = useParams<{ id: string }>();
  const examId = Number(params.id);

  const [exam, setExam] = useState<Exam | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [examData, yearData] = await Promise.all([
        examApi.getById(examId),
        academicYearApi.getAll(),
      ]);
      setExam(examData);
      setAcademicYears(yearData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load exam details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(examId)) loadData();
  }, [examId]);

  if (loading) return <LoadingSpinner text="Loading exam details..." />;

  if (error || !exam) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error || 'Exam not found.'}
        </div>
        <Link href="/exams" className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Exams
        </Link>
      </div>
    );
  }

  const year = academicYears.find((y) => y.id === exam.academicYearId);

  return (
    <div className="space-y-6">
      <Link
        href="/exams"
        className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exams
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{exam.name || 'Untitled Exam'}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {exam.term && <Badge variant="indigo">{exam.term}</Badge>}
                {year && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {year.yearName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <ListOrdered className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Exam ID</div>
              <div className="font-semibold text-[#111827]">{exam.id}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Academic Year</div>
              <div className="font-semibold text-[#111827]">{year?.yearName || '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Students Enrolled</div>
              <div className="font-semibold text-[#111827]">—</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#111827] mb-4">Result Entry</h2>
        <p className="text-sm text-slate-500">
          Exam schedule and result entry require backend endpoints that are not yet available.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href={`/exams/${exam.id}/schedule`}
            className="inline-flex items-center gap-2 text-xs font-medium text-white bg-[#5b51ef] hover:bg-[#4338ca] px-4 py-2 rounded-lg transition"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            View Schedule
          </Link>
          <Link
            href={`/exams/${exam.id}/results`}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5b51ef] bg-[#e5e5fa] hover:bg-[#d6d6f8] px-4 py-2 rounded-lg transition"
          >
            <Percent className="w-3.5 h-3.5" />
            Enter Results
          </Link>
        </div>
      </div>
    </div>
  );
}
