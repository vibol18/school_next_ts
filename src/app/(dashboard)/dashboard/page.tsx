import React from 'react';

const stats = [
  { label: 'Total Students', value: '1,248', color: 'bg-indigo-500' },
  { label: 'Total Teachers', value: '86', color: 'bg-emerald-500' },
  { label: 'Attendance Today', value: '94.2%', color: 'bg-amber-500' },
  { label: 'Fees Collected', value: '$128,400', color: 'bg-red-500' },
];

const admissions = [
  { name: 'Aiden Cole', grade: 'Grade 8 - B', status: 'Enrolled' },
  { name: 'Maya Chen', grade: 'Grade 5 - A', status: 'Enrolled' },
  { name: 'Noah Patel', grade: 'Grade 10 - C', status: 'Pending' },
  { name: 'Sofia Reyes', grade: 'Grade 3 - A', status: 'Enrolled' },
];

const events = [
  { date: 'Aug 4', title: 'Parent-Teacher Meeting' },
  { date: 'Aug 12', title: 'Mid-Term Exams Begin' },
  { date: 'Aug 20', title: 'Annual Sports Day' },
];

export default function DashboardPage() {
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
          <div className="divide-y divide-slate-100">
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
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {events.map((event, idx) => (
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
        </div>
      </div>
    </div>
  );
}