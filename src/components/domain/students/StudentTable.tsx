import React from "react";
import Link from "next/link";
import { Eye, Edit, UserX } from "lucide-react";

interface StudentTableProps {
  students: any[];
  loading?: boolean;
}

export function StudentTable({ students, loading }: StudentTableProps) {
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <UserX className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No students found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search filters.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-xl border-b border-slate-100">
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Class & Section</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((s) => (
              <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors duration-200">
                <td className="px-6 py-4 font-semibold text-slate-600">
                  {s.studentCode || s.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-white shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-700">
                        {s.firstName?.charAt(0)}{s.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {s.firstName} {s.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                  {s.className || "Grade 8 - B"}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    s.gender?.toLowerCase() === 'female' 
                      ? 'bg-pink-50 text-pink-600' 
                      : s.gender?.toLowerCase() === 'male' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.gender || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/students/${s.id}`}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 hover:shadow-sm hover:shadow-indigo-100 border border-transparent hover:border-indigo-100 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/students/${s.id}/edit`}
                      className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 hover:shadow-sm hover:shadow-indigo-100 border border-transparent hover:border-indigo-100 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
