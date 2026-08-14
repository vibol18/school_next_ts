"use client";

import React, { useState, useEffect } from "react";
import { sectionsApi } from "@/lib/api/academic";
import { studentsApi } from "@/lib/api/students";
import { attendanceApi } from "@/lib/api/attendance";
import { AttendanceGrid } from "@/components/domain/attendance/AttendanceGrid";
import { Save, Calendar } from "lucide-react";

export default function AttendancePage() {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    sectionsApi.getAll().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setSections(list);
      if (list.length > 0) setSelectedSection(String(list[0].id));
    });
  }, []);

  useEffect(() => {
    if (selectedSection) {
      setLoading(true);
      studentsApi.getBySection(selectedSection).then((data) => {
        const list = Array.isArray(data) ? data : [];
        setStudents(list);
        const initialStatus: Record<number, string> = {};
        list.forEach((s) => (initialStatus[s.id] = "PRESENT"));
        setAttendance(initialStatus);
        setLoading(false);
      });
    }
  }, [selectedSection]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        sectionId: selectedSection,
        date: new Date().toISOString().split("T")[0],
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId: parseInt(studentId),
          status,
        })),
      };
      await attendanceApi.markAttendance(payload);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = (studentId: number, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Record daily student attendance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-slate-600 font-medium text-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || students.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5b51ef] to-[#6a61f1] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center gap-4">
        <label className="text-sm font-bold text-slate-700 w-full sm:w-auto">Select Class Section:</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
        >
          {sections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.name || `Section ${sec.id}`}
            </option>
          ))}
        </select>
      </div>

      <AttendanceGrid 
        students={students}
        attendance={attendance}
        toggleStatus={toggleStatus}
        loading={loading}
      />
    </div>
  );
}