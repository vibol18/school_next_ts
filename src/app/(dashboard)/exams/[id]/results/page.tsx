'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { examApi, examResultApi } from '@/lib/api/exam.api';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, ClipboardCheck } from 'lucide-react';

export default function ExamResultsPage() {
  const params = useParams<{ id: string }>();
  const examId = Number(params.id);

  const [examName, setExamName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const exam = await examApi.getById(examId);
      setExamName(exam.name || '');
    } catch (err: any) {
      setError(err?.message || 'Failed to load exam.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(examId)) loadData();
  }, [examId]);

  if (loading) return <LoadingSpinner text="Loading exam..." />;

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
        <h1 className="text-2xl font-bold text-[#111827]">Exam Results</h1>
        <p className="text-sm text-slate-500">{examName ? `${examName} — student results` : 'Exam results'}</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center mb-4">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">Result entry not yet available</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Result entry requires per-student records. Contact your backend administrator to enable
            the exam results endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}
