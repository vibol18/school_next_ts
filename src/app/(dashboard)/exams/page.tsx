'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface ExamRecord {
  id: number;
  examName: string;
  subject: string;
  className: string;
  examDate: string;
  avgScore: number | null;
  status: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Swap to real API call when backend is ready
    setTimeout(() => {
      setExams([
        { id: 1, examName: 'Term 1 Final', subject: 'Mathematics', className: 'Class 10 - A', examDate: '2024-03-15', avgScore: 78.5, status: 'Graded' },
        { id: 2, examName: 'Term 1 Final', subject: 'Physics', className: 'Class 10 - A', examDate: '2024-03-18', avgScore: null, status: 'Scheduled' },
        { id: 3, examName: 'Mid-Term', subject: 'English', className: 'Class 9 - B', examDate: '2024-02-10', avgScore: 82.3, status: 'Graded' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredExams = exams.filter((e) => {
    const query = search.toLowerCase();
    return (
      e.examName.toLowerCase().includes(query) ||
      e.subject.toLowerCase().includes(query) ||
      e.className.toLowerCase().includes(query)
    );
  });

  const columns: Column<ExamRecord>[] = [
    { key: 'examName', header: 'Exam', render: (e) => <span className="font-semibold text-[#111827]">{e.examName}</span> },
    { key: 'subject', header: 'Subject' },
    { key: 'className', header: 'Class/Section' },
    { key: 'examDate', header: 'Date' },
    { key: 'avgScore', header: 'Avg. Score', render: (e) => e.avgScore ? `${e.avgScore}%` : <span className="text-slate-400">—</span> },
    {
      key: 'status',
      header: 'Status',
      render: (e) => <Badge>{e.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (e) => (
        <div className="flex gap-2">
          {e.status === 'Graded' ? (
            <button className="text-xs text-[#16a34a] hover:text-[#15803d] font-medium bg-[#dbf5e3] px-2 py-1 rounded">
              View Results
            </button>
          ) : (
            <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
              Enter Marks
            </button>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Exams & Results</h1>
        <p className="text-sm text-[#6b7280]">Manage exam schedules, enter student results, and generate report cards</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by exam name, subject, or class..."
        actionLabel="Create Exam"
        onAction={() => alert('Create Exam modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading exams..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredExams}
          keyExtractor={(e) => e.id}
          emptyMessage="No exams found."
        />
      )}
    </div>
  );
}