"use client";

import React, { useState } from "react";
import { User } from "lucide-react";

export interface StudentData {
  id: number | string;
  firstName?: string;
  lastName?: string;
  name?: string;
  studentCode?: string;
  admissionNo?: string;
  rollNo?: string | number;
  className?: string;
  section?: string;
  avatarUrl?: string;
  [key: string]: any; // Allows flexible backend fields
}

interface AttendanceGridProps {
  students: StudentData[];
  attendance: Record<string | number, string>;
  toggleStatus: (id: any, status: string) => void;
  notes?: Record<string | number, string>;
  onNoteChange?: (id: any, note: string) => void;
  loading?: boolean;
}

export function AttendanceGrid({
  students = [],
  attendance = {},
  toggleStatus,
  notes = {},
  onNoteChange,
  loading = false,
}: AttendanceGridProps) {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Checkbox Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const attendanceOptions = [
    { label: "Present", value: "PRESENT" },
    { label: "Late", value: "LATE" },
    { label: "Absent", value: "ABSENT" },
    { label: "Holiday", value: "HOLIDAY" },
    { label: "Halfday", value: "HALFDAY" },
  ];

  // Loading State UI
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-16 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#5b51ef]/30 border-t-[#5b51ef] rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  // Empty State UI
  if (!students || students.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-16 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
            <User className="w-7 h-7 text-slate-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No students found</h3>
            <p className="text-slate-400 text-xs mt-0.5">No attendance data to show for this selection.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="px-5 py-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === students.length && students.length > 0}
                  className="rounded border-slate-300 text-[#5b51ef] focus:ring-[#5b51ef]"
                />
              </th>
              <th className="px-5 py-4 font-bold text-slate-700">
                Admission No <span className="text-[10px] text-slate-400">♦</span>
              </th>
              <th className="px-5 py-4 font-bold text-slate-700">
                Roll No <span className="text-[10px] text-slate-400">♦</span>
              </th>
              <th className="px-5 py-4 font-bold text-slate-700">Name</th>
              <th className="px-5 py-4 font-bold text-slate-700">Class</th>
              <th className="px-5 py-4 font-bold text-slate-700">Section</th>
              <th className="px-5 py-4 font-bold text-slate-700">Attendance</th>
              <th className="px-5 py-4 font-bold text-slate-700 text-center w-48">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.map((s, index) => {
              const currentStatus = attendance[s.id] || "PRESENT";
              const isSelected = selectedIds.includes(s.id);
              
              // Handle name formatting dynamically from API response
              const fullName = s.name || `${s.firstName || ""} ${s.lastName || ""}`.trim() || `Student ${s.id}`;
              const admissionNo = s.admissionNo || s.studentCode || s.code || `ID-${s.id}`;
              const rollNo = s.rollNo ?? (index + 1);
              const initials = fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? "bg-slate-50" : ""
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(s.id)}
                      className="rounded border-slate-300 text-[#5b51ef] focus:ring-[#5b51ef]"
                    />
                  </td>

                  {/* Admission No */}
                  <td className="px-5 py-3.5 font-semibold text-[#5b51ef]">
                    {admissionNo}
                  </td>

                  {/* Roll No */}
                  <td className="px-5 py-3.5 text-slate-600">{rollNo}</td>

                  {/* Name + Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold overflow-hidden shrink-0 border border-slate-200 text-xs">
                        {s.avatarUrl ? (
                          <img src={s.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-800">{fullName}</span>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{s.className || s.class || "-"}</td>

                  {/* Section */}
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{s.section || "-"}</td>

                  {/* Radio Buttons for Attendance */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3.5 text-xs">
                      {attendanceOptions.map((opt) => {
                        const isChecked = currentStatus === opt.value;

                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900 font-medium"
                          >
                            <input
                              type="radio"
                              name={`attendance-${s.id}`}
                              value={opt.value}
                              checked={isChecked}
                              onChange={() => toggleStatus(s.id, opt.value)}
                              className="w-4 h-4 text-[#5b51ef] border-slate-300 focus:ring-[#5b51ef] cursor-pointer"
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </td>

                  {/* Notes Input Field */}
                  <td className="px-5 py-3.5">
                    <input
                      type="text"
                      placeholder=""
                      value={notes[s.id] || ""}
                      onChange={(e) => onNoteChange && onNoteChange(s.id, e.target.value)}
                      className="w-full px-3 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#5b51ef] focus:border-[#5b51ef] transition"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}