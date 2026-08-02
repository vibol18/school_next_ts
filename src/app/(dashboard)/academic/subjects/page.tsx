"use client";

import React, { useEffect, useState } from "react";
import { subjectsApi } from "@/lib/api/academic";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    subjectsApi.getAll().then((data) => setSubjects(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Subjects Directory</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="divide-y divide-slate-100">
          {subjects.map((sub) => (
            <div key={sub.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{sub.name}</p>
                <p className="text-xs text-slate-400">Code: {sub.code || `SUB-${sub.id}`}</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                {sub.type || "Theory"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}