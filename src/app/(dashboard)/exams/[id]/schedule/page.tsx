'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { examApi, examScheduleApi } from '@/lib/api/exam.api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Pagination } from '@/components/shared/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';
import { ArrowLeft, CalendarDays, ListOrdered } from 'lucide-react';

interface ScheduleRow {
  id: number;
  subjectName?: string;
  examDate?: string;
  startTime?: string;
  endTime?: string;
}

export default function ExamSchedulePage() {
  const params = useParams<{ id: string }>();
  const examId = Number(params.id);

  const [examName, setExamName] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [exam, data] = await Promise.all([
        examApi.getById(examId),
        examScheduleApi.getByExam(examId),
      ]);
      setExamName(exam.name || '');
      setSchedules((data as ScheduleRow[]) ?? []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load exam schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(examId)) loadData();
  }, [examId]);

  const { page, setPage, pagedItems, totalItems } = usePagination(schedules);

  if (loading) return <LoadingSpinner text="Loading exam schedule..." />;

  return (
    <div className="space-y-6">
      <Link
        href={`/exams/${examId}`}
        className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Exam Schedule</h1>
        <p className="text-sm text-slate-500">{examName ? `${examName} — schedule of exams` : 'Exam schedule'}</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">No exam schedules yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              The exam schedule endpoint returned no entries for this exam.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Start</th>
                <th className="px-6 py-3 font-semibold">End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedItems.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 flex items-center gap-2 text-[#111827] font-medium">
                    <ListOrdered className="w-4 h-4 text-[#5b51ef]" />
                    {s.subjectName || `Subject ${s.id}`}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{s.examDate || '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{s.startTime || '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{s.endTime || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} pageSize={10} totalItems={totalItems} onPageChange={setPage} />
      </div>
    </div>
  );
}
