'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { teacherApi } from '@/lib/api/teachers';
import { Teacher } from '@/types/teacher.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { GraduationCap, Pencil, Trash2, Eye } from 'lucide-react';

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherApi.getAll();
      setTeachers(data);
    } catch (err) {
      setError('Failed to fetch teachers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await teacherApi.delete(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Failed to delete teacher record.');
    }
  };

  const filtered = teachers.filter((t) => {
    const query = search.toLowerCase();
    return (
      (t.employeeId || '').toLowerCase().includes(query) ||
      (t.qualification || '').toLowerCase().includes(query)
    );
  });

  const columns: Column<Teacher>[] = [
    {
      key: 'employeeId',
      header: 'Teacher',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-[#111827]">{t.employeeId}</div>
            <div className="text-xs text-slate-400">ID #{t.id}</div>
          </div>
        </div>
      ),
    },
    { key: 'qualification', header: 'Qualification', render: (t) => <span className="text-slate-600">{t.qualification || '—'}</span> },
    {
      key: 'experienceYears',
      header: 'Experience',
      render: (t) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10">
          {t.experienceYears ? `${t.experienceYears} yrs` : '—'}
        </span>
      ),
    },
    {
      key: 'dateOfJoining',
      header: 'Date Joined',
      render: (t) => {
        if (!t.dateOfJoining) return <span className="text-slate-300">—</span>;
        const d = new Date(t.dateOfJoining);
        return (
          <span className="text-slate-600">
            {!isNaN(d.getTime())
              ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : t.dateOfJoining}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/teachers/${t.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#5b51ef] hover:text-[#4338ca] bg-[#5b51ef]/5 hover:bg-[#5b51ef]/10 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <Eye className="w-3 h-3" />
            View
          </Link>
          <Link
            href={`/teachers/${t.id}/edit`}
            className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </Link>
          <button
            onClick={() => handleDelete(t.id)}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers Directory</h1>
          <p className="text-sm text-gray-500">Manage academic staff records and assignments</p>
        </div>
        <Link
          href="/teachers/new"
          className="inline-flex items-center gap-2 bg-[#5b51ef] hover:bg-[#4b42db] text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
        >
          + Add Teacher
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by employee ID or qualification..."
      />

      {loading ? (
        <LoadingSpinner text="Loading directory..." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(t) => t.id}
          emptyMessage={
            search
              ? `No teachers match "${search}".`
              : 'No teacher records found. Click "Add Teacher" to create one.'
          }
        />
      )}
    </div>
  );
}
