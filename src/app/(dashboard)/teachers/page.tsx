'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { teacherApi } from '@/lib/api/teachers';
import { Teacher } from '@/types/teacher.types';

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teachers Directory</h1>
          <p className="text-sm text-gray-500">Manage academic staff records and assignments</p>
        </div>
        <Link
          href="/teachers/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
        >
          + Add Teacher
        </Link>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading directory...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Qualification</th>
                <th className="px-6 py-3">Experience</th>
                <th className="px-6 py-3">Date Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{t.employeeId}</td>
                  <td className="px-6 py-4">{t.qualification}</td>
                  <td className="px-6 py-4">{t.experienceYears} yrs</td>
                  <td className="px-6 py-4">{t.dateOfJoining}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/teachers/${t.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                    <Link href={`/teachers/${t.id}/edit`} className="text-amber-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No teacher records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}