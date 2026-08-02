import React from "react";
import { Award, AlertCircle } from "lucide-react";

interface ResultsTableProps {
  results: any[];
  maxMarks?: number;
  passingMarks?: number;
}

export function ResultsTable({ results, maxMarks = 100, passingMarks = 40 }: ResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No results found</h3>
            <p className="text-slate-500 text-sm mt-1">Scores have not been uploaded for this exam yet.</p>
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
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Marks Obtained</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Percentage</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {results.map((r, i) => {
              const marks = r.marksObtained || 0;
              const isPassed = marks >= passingMarks;
              const percentage = Math.round((marks / maxMarks) * 100);

              return (
                <tr key={r.id || i} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">
                      {r.studentName || "Unknown Student"}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">
                      {r.studentCode || `ID: ${r.studentId}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-black text-slate-700">
                      {marks}
                    </span>
                    <span className="text-xs font-medium text-slate-400 ml-1">/ {maxMarks}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-600 w-9">{percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isPassed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {isPassed ? <Award className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {isPassed ? "PASS" : "FAIL"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-slate-500 italic">
                    {r.remarks || "-"}
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
