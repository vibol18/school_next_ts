'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api/students';
import { teacherApi } from '@/lib/api/teachers';
import { eventApi } from '@/lib/api/communication.api';
import { classApi, sectionApi, subjectApi, academicYearApi } from '@/lib/api/academic.api';
import type { Student, Event } from '@/types/school.types';
import type { Teacher } from '@/types/teacher.types';
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react';

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

  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classApi.getAll(),
  });

  const { data: sections = [], isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => sectionApi.getAll(),
  });

  const { data: subjects = [], isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectApi.getAll(),
  });

  const { data: academicYears = [], isLoading: loadingYears } = useQuery({
    queryKey: ['academic-years'],
    queryFn: () => academicYearApi.getAll(),
  });

  const currentYear = academicYears.find((y) => y.current) || academicYears[0];
  const today = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.eventDate) >= today)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 4);

  const recentStudents = students.slice(0, 5);

  const statCards = [
    {
      label: 'Total Students',
      value: loadingStudents ? '—' : students.length,
      icon: <Users className="w-4 h-4 text-[#5b51ef]" />,
      color: '#5b51ef',
      href: '/students',
    },
    {
      label: 'Total Teachers',
      value: loadingTeachers ? '—' : teachers.length,
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      color: '#10b981',
      href: '/teachers',
    },
    {
      label: 'Classes',
      value: loadingClasses ? '—' : classes.length,
      icon: <School className="w-4 h-4 text-amber-600" />,
      color: '#f59e0b',
      href: '/academic/classes',
    },
    {
      label: 'Subjects',
      value: loadingSubjects ? '—' : subjects.length,
      icon: <BookOpen className="w-4 h-4 text-sky-600" />,
      color: '#0ea5e9',
      href: '/academic/subjects',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5b51ef] via-[#5b51ef] to-[#4338ca] px-6 py-6 sm:px-8 sm:py-7 text-white shadow-lg shadow-indigo-200/50">
        <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-24 -bottom-20 w-40 h-40 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-100 text-xs font-medium uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              {loadingYears ? 'Academic year…' : currentYear ? `${currentYear.yearName} • ${currentYear.current ? 'Current' : ''}` : 'Welcome back'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              School Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100/90 max-w-lg">
              Overview of your school&apos;s activity — students, teachers, classes and upcoming events.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/students/new"
              className="inline-flex items-center gap-2 bg-white text-[#5b51ef] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition shadow-sm"
            >
              <Users className="w-4 h-4" />
              Add Student
            </Link>
            <Link
              href="/exams/new"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/25 transition"
            >
              <GraduationCap className="w-4 h-4" />
              New Exam
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '14' }}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">
                {stat.value}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#5b51ef] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admissions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {loadingSections ? 'Loading sections…' : `${sections.length} sections across the school`}
              </p>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-[#5b51ef] hover:text-[#4338ca] inline-flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingStudents ? (
            <div className="flex items-center justify-center py-12 text-sm text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading students…
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentStudents.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-400">
                  No students yet. Add your first student to get started.
                </div>
              )}
              {recentStudents.map((student) => {
                const initials = `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase();
                return (
                  <div key={student.id} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a60f5] to-[#4238d1] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials || student.admissionNumber?.slice(-2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {`${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unnamed student'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {student.email || student.admissionNumber || `ID #${student.id}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                        {student.admissionNumber}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                        Enrolled
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Events</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {loadingEvents ? 'Loading…' : `${upcomingEvents.length} coming up`}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {loadingEvents ? (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading…
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8">
                No upcoming events scheduled.
              </div>
            ) : (
              upcomingEvents.map((event, idx) => {
                const d = new Date(event.eventDate);
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-12 shrink-0 text-center rounded-lg border border-slate-200 bg-slate-50 py-1.5">
                      <div className="text-sm font-bold text-[#5b51ef] uppercase leading-none">
                        {d.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                        {d.getDate()}
                      </div>
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm font-medium text-slate-800 leading-snug">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {event.location || '—'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            <Link
              href="/communication/events"
              className="flex items-center justify-center gap-1.5 w-full mt-2 text-xs font-semibold text-[#5b51ef] hover:text-[#4338ca] bg-[#5b51ef]/5 hover:bg-[#5b51ef]/10 rounded-lg py-2.5 transition"
            >
              Manage events
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
