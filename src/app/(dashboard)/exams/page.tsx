'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { examApi } from '@/lib/api/exam.api';
import { academicYearApi } from '@/lib/api/academic.api';
import type { Exam, AcademicYear } from '@/types/school.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import { CalendarDays, FileText } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [examData, yearData] = await Promise.all([
        examApi.getAll(),
        academicYearApi.getAll(),
      ]);
      setExams(examData);
      setAcademicYears(yearData);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch exams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const yearName = (id: number) => academicYears.find((y) => y.id === id)?.yearName;

  const filteredExams = exams.filter((e) => {
    const query = search.toLowerCase();
    return (
      (e.name || '').toLowerCase().includes(query) ||
      (e.term || '').toLowerCase().includes(query) ||
      (yearName(e.academicYearId) || '').toLowerCase().includes(query)
    );
  });

  const columns: Column<Exam>[] = [
    {
      key: 'name',
      header: 'Exam',
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[#111827]">{e.name || 'Untitled Exam'}</span>
        </div>
      ),
    },
    {
      key: 'term',
      header: 'Term',
      render: (e) =>
        e.term ? (
          <Badge variant="indigo">{e.term}</Badge>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
    {
      key: 'academicYearId',
      header: 'Academic Year',
      render: (e) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
          {yearName(e.academicYearId) || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (e) => (
        <Link
          href={`/exams/${e.id}`}
          className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-3 py-1.5 rounded-md transition"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Exams & Results</h1>
        <p className="text-sm text-[#6b7280]">Manage exam schedules, enter student results, and generate report cards</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by exam name, term, or academic year..."
        actionHref="/exams/new"
        actionLabel="Create Exam"
      />

      {loading ? (
        <LoadingSpinner text="Loading exams..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredExams}
          keyExtractor={(e) => e.id}
          emptyMessage="No exams found. Click 'Create Exam' to add one."
        />
      )}
    </div>
  );
}
