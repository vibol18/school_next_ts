"use client";

import React, { useEffect, useState } from "react";
import { examsApi } from "@/lib/api/exams";
import { Plus, Calendar, BookOpen } from "lucide-react";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    examsApi.getAll().then((data) => setExams(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Assessments</h1>
          <p className="text-sm text-slate-500">Manage schedules and entry of student grades</p>
        </div>
        <button className="bg-[#5b51ef] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 text-base">{exam.name || "Term Exam"}</h3>
              <span className="text-[10px] bg-indigo-50 text-[#5b51ef] font-semibold px-2 py-0.5 rounded-full">
                {exam.status || "SCHEDULED"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />src/app/login/page.tsx
                <span>{exam.examDate || "Aug 15, 2026"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Max Marks: {exam.maxMarks || 100}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}