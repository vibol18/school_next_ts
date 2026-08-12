'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api/students';
import { teacherApi } from '@/lib/api/teachers';
import { eventApi } from '@/lib/api/communication.api';
import type { Student, Event } from '@/types/school.types';
import type { Teacher } from '@/types/teacher.types'; // Using teacher.types as it contains Teacher

export default function DashboardPage() {
  const { data: students = [], isLoading: loadingStudents } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: teachers = [], isLoading: loadingTeachers } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: () => teacherApi.getAll(),
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => eventApi.getAll(),
  });

  const stats = [
    { label: 'Total Students', value: loadingStudents ? '...' : students.length, color: 'bg-indigo-500' },
    { label: 'Total Teachers', value: loadingTeachers ? '...' : teachers.length, color: 'bg-emerald-500' },
    { label: 'Attendance Today', value: '94.2%', color: 'bg-amber-500' }, // Hardcoded for now
    { label: 'Fees Collected', value: '$128,400', color: 'bg-red-500' }, // Hardcoded for now
  ];

  // We could use students array to show recent admissions (e.g. last 4)
  const admissions = Array.isArray(students) ? students.slice(0, 4).map(s => ({
    name: `${s.firstName || s.username || 'Unknown'} ${s.lastName || ''}`.trim(),
    grade: s.admissionNumber || 'New',
    status: 'Enrolled'
  })) : [];

  const upcomingEvents = Array.isArray(events) ? events.slice(0, 3).map(e => ({
    date: new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    title: e.title
  })) : [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col"
          >
            <div className={`h-1 w-10 ${stat.color} rounded-full mb-3`} />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Recent Admissions
          </h3>
          {loadingStudents ? (
            <div className="text-sm text-slate-500 py-4">Loading admissions...</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {admissions.length === 0 && (
                <div className="py-3.5 text-sm text-slate-500">No recent admissions.</div>
              )}
              {admissions.map((student, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex items-center justify-between text-sm first:pt-0 last:pb-0"
                >
                  <span className="font-semibold text-slate-800">
                    {student.name}
                  </span>
                  <span className="text-slate-500">{student.grade}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Enrolled'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Upcoming Events
          </h3>
          {loadingEvents ? (
            <div className="text-sm text-slate-500 py-4">Loading events...</div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.length === 0 && (
                <div className="text-sm text-slate-500">No upcoming events.</div>
              )}
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-xs font-semibold text-indigo-600 block">
                    {event.date}
                  </span>
                  <span className="text-sm text-slate-800 font-medium block">
                    {event.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
