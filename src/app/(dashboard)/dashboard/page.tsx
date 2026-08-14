'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { studentsApi } from '@/lib/api/students';
import { notificationApi } from '@/lib/api/notification.api';
import { classesApi, sectionsApi } from '@/lib/api/academic';
import { enrollmentsApi } from '@/lib/api/enrollments';
import type { Notification } from '@/types/school.types';
import { Pagination } from '@/components/shared/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';
import {
  Users,
  ClipboardList,
  GraduationCap,
  Banknote,
  Search,
  RotateCcw,
  Bell,
  ArrowRight,
  ExternalLink,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';

interface StudentRow {
  id: number;
  admissionNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  phone?: string;
  dob?: string;
  profilePhoto?: string | null;
}

interface EnrichedRow extends StudentRow {
  className?: string;
  sectionName?: string;
  parentName?: string;
}

function getInitials(s: StudentRow) {
  return `${s.firstName?.charAt(0) || ''}${s.lastName?.charAt(0) || ''}`.toUpperCase() || 'S';
}

function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Donut chart (students by gender) ────────────────────────────────
function GenderDonut({ female, male }: { female: number; male: number }) {
  const total = female + male || 1;
  const r = 74;
  const stroke = 26;
  const c = 2 * Math.PI * r;
  const fLen = (female / total) * c;
  const mLen = (male / total) * c;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[190px] h-[190px] shrink-0">
        <svg viewBox="0 0 190 190" className="w-full h-full -rotate-90">
          <circle cx="95" cy="95" r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {female > 0 && (
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={stroke}
              strokeDasharray={`${fLen} ${c - fLen}`}
              strokeLinecap="round"
            />
          )}
          {male > 0 && (
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={stroke}
              strokeDasharray={`${mLen} ${c - mLen}`}
              strokeDashoffset={-fLen}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900">{female + male}</span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
            Students
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-500" />
            <span className="text-sm font-semibold text-slate-700">Female</span>
            <span className="ml-auto text-sm font-bold text-slate-900">{female}</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">{Math.round((female / total) * 100)}% of students</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-slate-700">Male</span>
            <span className="ml-auto text-sm font-bold text-slate-900">{male}</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">{Math.round((male / total) * 100)}% of students</p>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications feed ──────────────────────────────────────────────
function NotificationsFeed({ notifications, loading }: { notifications: Notification[]; loading: boolean }) {
  const list = (Array.isArray(notifications) ? notifications : []).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 leading-tight">Notifications</h2>
            <p className="text-[11px] text-slate-400">Latest announcements</p>
          </div>
        </div>
        <Link
          href="/notifications"
          className="text-[12px] font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex-1 divide-y divide-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : list.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">You&apos;re all caught up!</p>
          </div>
        ) : (
          list.map((n) => {
            const d = n.createdAt ? new Date(n.createdAt) : null;
            const isToday = d ? d.toDateString() === new Date().toDateString() : false;
            return (
              <div key={n.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="w-12 shrink-0 text-center rounded-lg border border-slate-200 bg-slate-50 py-1">
                  <div className="text-[10px] font-bold uppercase text-accent-600 leading-none">
                    {d ? d.toLocaleDateString('en-US', { month: 'short' }) : '—'}
                  </div>
                  <div className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                    {d ? d.getDate() : '–'}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />}
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  {isToday && (
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRole(localStorage.getItem('userRole'));
      const stored = localStorage.getItem('userId');
      if (stored) setUserId(parseInt(stored, 10));
    }
  }, []);

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const { data: students = [], isLoading: loadingStudents } = useQuery<StudentRow[]>({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
  });

  const { data: notifications = [], isLoading: loadingNotifications } = useQuery<Notification[]>({
    queryKey: ['notifications', userId, role],
    queryFn: () => notificationApi.getByRecipient(userId!, role || ''),
    enabled: !!userId && !!role,
  });

  // Enrich students with class / section via enrollments → sections → classes
  const [sections, setSections] = useState<{ id: number; name: string; classId?: number }[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [enrollments, setEnrollments] = useState<{ studentId: number; sectionId: number }[]>([]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      sectionsApi.getAll(),
      classesApi.getAll(),
      enrollmentsApi.getAll(),
    ]).then(([sec, cls, enr]) => {
      if (!active) return;
      if (sec.status === 'fulfilled') setSections(Array.isArray(sec.value) ? sec.value : []);
      if (cls.status === 'fulfilled') setClasses(Array.isArray(cls.value) ? cls.value : []);
      if (enr.status === 'fulfilled') setEnrollments(Array.isArray(enr.value) ? enr.value : []);
    });
    return () => {
      active = false;
    };
  }, []);

  const sectionToClass = useMemo(() => {
    const map = new Map<number, number>();
    sections.forEach((s) => {
      if (s.classId !== undefined) map.set(s.id, s.classId);
    });
    return map;
  }, [sections]);

  const classNames = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [classes]);

  const sectionNames = useMemo(() => {
    const map = new Map<number, string>();
    sections.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [sections]);

  const enriched: EnrichedRow[] = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    return list.map((s) => {
      const enr = enrollments.find((e) => e.studentId === s.id);
      const sectionId = enr?.sectionId;
      const sectionName = sectionId ? sectionNames.get(sectionId) : undefined;
      const classId = sectionId ? sectionToClass.get(sectionId) : undefined;
      const className = classId ? classNames.get(classId) : undefined;
      return {
        ...s,
        sectionName: sectionName || undefined,
        className: className || undefined,
      };
    });
  }, [students, enrollments, sectionNames, sectionToClass, classNames]);

  // ── Search state ──
  const [rollQuery, setRollQuery] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');
  const [filters, setFilters] = useState({ roll: '', name: '', className: '' });

  const filtered = useMemo(() => {
    return enriched.filter((s) => {
      const matchRoll = !filters.roll || (s.admissionNumber || '').toLowerCase().includes(filters.roll.toLowerCase());
      const matchName =
        !filters.name ||
        `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(filters.name.toLowerCase());
      const matchClass = !filters.className || (s.className || '').toLowerCase().includes(filters.className.toLowerCase());
      return matchRoll && matchName && matchClass;
    });
  }, [enriched, filters]);

  const { page, setPage, pagedItems, totalItems } = usePagination(filtered, 8);

  // ── Row selection ──
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const pageIds = pagedItems.map((s) => s.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => next.has(id));
      pageIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const genderCounts = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    let female = 0;
    let male = 0;
    list.forEach((s) => {
      const g = (s.gender || '').toUpperCase();
      if (g === 'FEMALE') female += 1;
      else if (g === 'MALE') male += 1;
    });
    return { female, male };
  }, [students]);

  const kpis = [
    {
      label: 'Total Students',
      value: loadingStats ? '—' : String(stats?.totalStudents ?? 0),
      icon: <Users className="w-5 h-5" />,
      chip: 'bg-accent-50 text-accent-600',
      footer: `Total Teachers: ${stats?.totalTeachers ?? 0}`,
    },
    {
      label: 'Total Classes',
      value: loadingStats ? '—' : String(stats?.totalClasses ?? 0),
      icon: <ClipboardList className="w-5 h-5" />,
      chip: 'bg-blue-50 text-blue-600',
      footer: `${stats?.totalSections ?? 0} sections`,
    },
    {
      label: 'Graduate Students',
      value: loadingStats ? '—' : String(stats?.totalEnrollments ?? 0),
      icon: <GraduationCap className="w-5 h-5" />,
      chip: 'bg-emerald-50 text-emerald-600',
      footer: `${stats?.totalStaff ?? 0} staff members`,
    },
    {
      label: 'Total Income',
      value: loadingStats ? '—' : `$${(stats?.feesCollected ?? 0).toLocaleString()}`,
      icon: <Banknote className="w-5 h-5" />,
      chip: 'bg-violet-50 text-violet-600',
      footer: `$${(stats?.feesPending ?? 0).toLocaleString()} pending`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Row 1: KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.chip}`}>
                {kpi.icon}
              </div>
              <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
                KPI
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
            <p className="text-[13px] font-semibold text-slate-500 mt-0.5">{kpi.label}</p>
            <p className="mt-3 text-[11px] font-medium text-slate-400 border-t border-slate-100 pt-2.5">
              {kpi.footer}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2: Donut chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold text-slate-900 leading-tight">Students</h2>
                <p className="text-[11px] text-slate-400">Gender breakdown</p>
              </div>
            </div>
            <Link
              href="/students"
              className="text-[12px] font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6 flex items-center justify-center">
            {loadingStudents ? (
              <div className="flex items-center justify-center py-14 text-sm text-slate-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : (
              <GenderDonut female={genderCounts.female} male={genderCounts.male} />
            )}
          </div>
        </div>

        <NotificationsFeed notifications={notifications} loading={loadingNotifications} />
      </div>

      {/* Row 3: My Students data table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">My Students</h2>
            <p className="text-[11px] text-slate-400">
              {totalItems} records
              {selected.size > 0 && <span className="text-accent-600 font-semibold"> · {selected.size} selected</span>}
            </p>
          </div>
          <Link
            href="/students/new"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" /> Add Student
          </Link>
        </div>

        {/* Table controls */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Search by Roll</label>
            <input
              value={rollQuery}
              onChange={(e) => setRollQuery(e.target.value)}
              placeholder="e.g. STD-001"
              className="w-44 px-3 py-2 text-[13px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/25 focus:border-accent-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Search by Name</label>
            <input
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Student name…"
              className="w-52 px-3 py-2 text-[13px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/25 focus:border-accent-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Search by Class</label>
            <input
              value={classQuery}
              onChange={(e) => setClassQuery(e.target.value)}
              placeholder="e.g. Grade 10"
              className="w-40 px-3 py-2 text-[13px] rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/25 focus:border-accent-500"
            />
          </div>
          <button
            onClick={() => setFilters({ roll: rollQuery, name: nameQuery, className: classQuery })}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" /> Search
          </button>
          <button
            onClick={() => {
              setRollQuery('');
              setNameQuery('');
              setClassQuery('');
              setFilters({ roll: '', name: '', className: '' });
            }}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl hover:bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Table */}
        {loadingStudents ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading students…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No students found</p>
            <p className="text-xs text-slate-400 mt-1">
              {filters.roll || filters.name || filters.className
                ? 'Try adjusting your search filters.'
                : 'Click "Add Student" to create the first record.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={pagedItems.length > 0 && pagedItems.every((s) => selected.has(s.id))}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500 accent-accent-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3 font-semibold">Roll</th>
                  <th className="px-3 py-3 font-semibold">Photo</th>
                  <th className="px-3 py-3 font-semibold">Name</th>
                  <th className="px-3 py-3 font-semibold">Gender</th>
                  <th className="px-3 py-3 font-semibold">Class</th>
                  <th className="px-3 py-3 font-semibold">Section</th>
                  <th className="px-3 py-3 font-semibold">Parents</th>
                  <th className="px-3 py-3 font-semibold">Address</th>
                  <th className="px-3 py-3 font-semibold">Date of Birth</th>
                  <th className="px-3 py-3 font-semibold">Phone</th>
                  <th className="px-3 py-3 font-semibold">Email</th>
                  <th className="px-3 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedItems.map((s) => (
                  <tr key={s.id} className="hover:bg-accent-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleRow(s.id)}
                        className="w-4 h-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500 accent-accent-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 font-mono text-[12px] text-slate-500">
                      {s.admissionNumber || `#${s.id}`}
                    </td>
                    <td className="px-3 py-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {s.profilePhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.profilePhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(s)
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-800">
                        {`${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed student'}
                      </p>
                      <p className="text-[11px] text-slate-400">{s.bloodGroup || '—'}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          (s.gender || '').toUpperCase() === 'FEMALE'
                            ? 'bg-accent-50 text-accent-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {(s.gender || '—').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{s.className || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{s.sectionName || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{s.parentName || '—'}</td>
                    <td className="px-3 py-3 text-slate-500 max-w-[160px] truncate">{s.address || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{formatDate(s.dateOfBirth || s.dob)}</td>
                    <td className="px-3 py-3 text-slate-600">{s.phone || '—'}</td>
                    <td className="px-3 py-3 text-slate-500 max-w-[180px] truncate">{s.email || '—'}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/students/${s.id}`}
                          className="text-[12px] font-semibold text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          aria-label="More actions"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t border-slate-100">
          <Pagination page={page} pageSize={8} totalItems={totalItems} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
