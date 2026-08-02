'use client';

import { studentsApi } from '@/lib/api/students';
import { Plus, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

export default function StudentsPage() {
  const { data: students, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const studentList = Array.isArray(students) ? students : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students Directory</h1>
          <p className="text-sm text-gray-500">Manage student records and user profiles</p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          Failed to load student data. Please check backend API server connection.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {studentList.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No students found yet. Create the first student record to get started.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="py-3.5 px-4">Admission No.</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Date of Birth</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentList.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{student.admissionNumber}</td>
                    <td className="py-3.5 px-4 text-gray-600">{student.gender}</td>
                    <td className="py-3.5 px-4 text-gray-600">{student.dateOfBirth}</td>
                    <td className="py-3.5 px-4 text-gray-600">{student.bloodGroup || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/students/${student.id}`}
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        View Full Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}