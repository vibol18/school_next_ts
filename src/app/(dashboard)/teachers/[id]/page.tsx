'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { teacherApi } from '@/lib/api/teachers';
import { Teacher, Subject } from '@/types/teacher.types';

export default function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const teacherId = parseInt(id, 10);

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [teacherData, subjectsData] = await Promise.all([
          teacherApi.getById(teacherId),
          teacherApi.getSubjects(teacherId),
        ]);
        setTeacher(teacherData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [teacherId]);

  if (loading) return <div className="p-6 text-gray-500">Loading profile...</div>;
  if (!teacher) return <div className="p-6 text-red-500">Teacher record not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teacher Profile</h1>
          <p className="text-sm text-gray-500">Employee ID: {teacher.employeeId}</p>
        </div>
        <Link
          href={`/teachers/${teacher.id}/timetable`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
        >
          View Timetable Schedule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Employment Details</h2>
          <div className="text-sm space-y-1">
            <p><span className="font-medium text-gray-500">Qualification:</span> {teacher.qualification}</p>
            <p><span className="font-medium text-gray-500">Experience:</span> {teacher.experienceYears} Years</p>
            <p><span className="font-medium text-gray-500">Date of Joining:</span> {teacher.dateOfJoining}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Assigned Subjects</h2>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-400">No subjects assigned yet.</p>
          ) : (
            <ul className="divide-y text-sm">
              {subjects.map((sub) => (
                <li key={sub.id} className="py-2 flex justify-between">
                  <span>{sub.name}</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{sub.code}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}