'use client';

import { studentsApi } from '@/lib/api/students';
import { Plus, UserCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface StudentRow {
  id: number;
  admissionNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
}

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const { data: students, isLoading, isError } = useQuery<StudentRow[]>({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const [search, setSearch] = useState(searchParams?.get('q') || '');

  useEffect(() => {
    const q = searchParams?.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const studentList = Array.isArray(students) ? students : [];

  const filtered = studentList.filter((s) => {
    const query = search.toLowerCase();
    const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    return (
      name.includes(query) ||
      (s.admissionNumber || '').toLowerCase().includes(query) ||
      (s.email || '').toLowerCase().includes(query)
    );
  });

  const initials = (s: StudentRow) =>
    `${s.firstName?.charAt(0) || ''}${s.lastName?.charAt(0) || ''}`.toUpperCase() || 'S';

  const columns: Column<StudentRow>[] = [
    {
      key: 'name',
      header: 'Student',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6a60f5] to-[#4238d1] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials(s)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[#111827] truncate">
              {`${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed student'}
            </div>
            {s.email && <div className="text-xs text-slate-400 truncate">{s.email}</div>}
          </div>
        </div>
      ),
    },
    {
      key: 'admissionNumber',
      header: 'Admission No.',
      render: (s) => (
        <span className="font-mono text-xs text-slate-500">{s.admissionNumber || '—'}</span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (s) => (
        <span className="text-slate-600 capitalize">{s.gender?.toLowerCase() || '—'}</span>
      ),
    },
    {
      key: 'dateOfBirth',
      header: 'Date of Birth',
      render: (s) => {
        if (!s.dateOfBirth) return <span className="text-slate-300">—</span>;
        const d = new Date(s.dateOfBirth);
        return (
          <span className="text-slate-600">
            {!isNaN(d.getTime())
              ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : s.dateOfBirth}
          </span>
        );
      },
    },
    {
      key: 'bloodGroup',
      header: 'Blood Group',
      render: (s) =>
        s.bloodGroup ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10">
            {s.bloodGroup}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (s) => (
        <Link
          href={`/students/${s.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#5b51ef] hover:text-[#4338ca] font-medium"
        >
          <UserCheck className="w-3.5 h-3.5" />
          View Profile
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Directory</h1>
          <p className="text-sm text-gray-500">Manage student records and user profiles</p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 bg-[#5b51ef] hover:bg-[#4b42db] text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          Failed to load student data. Please check backend API server connection.
        </div>
      )}

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, admission number, or email..."
      />

      {isLoading ? (
        <LoadingSpinner text="Loading students..." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s.id}
          emptyMessage={
            search
              ? `No students match "${search}".`
              : 'No students found yet. Click "Add Student" to create one.'
          }
        />
      )}

      {!isLoading && studentList.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5" />
          Showing {filtered.length} of {studentList.length} students
        </div>
      )}
    </div>
  );
}
