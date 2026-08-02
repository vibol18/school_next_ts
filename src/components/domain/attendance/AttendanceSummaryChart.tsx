import React from "react";
import { TrendingUp, Users } from "lucide-react";

interface AttendanceSummaryChartProps {
  present: number;
  absent: number;
  late: number;
}

export function AttendanceSummaryChart({ present, absent, late }: AttendanceSummaryChartProps) {
  const total = present + absent + late;
  const getPercentage = (value: number) => total === 0 ? 0 : Math.round((value / total) * 100);

  const presentPct = getPercentage(present);
  const absentPct = getPercentage(absent);
  const latePct = getPercentage(late);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Today's Overview
          </h3>
          <p className="text-xs text-slate-500 mt-1">Class attendance distribution</p>
        </div>
        <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-indigo-100">
          <Users className="w-3.5 h-3.5" />
          {total} Students
        </div>
      </div>

      {total === 0 ? (
        <div className="h-40 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium text-sm">No attendance data available</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Present Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-emerald-600">Present</span>
              <span className="text-slate-700">{present} <span className="text-slate-400 font-medium ml-1">({presentPct}%)</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${presentPct}%` }}
              />
            </div>
          </div>

          {/* Absent Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-rose-600">Absent</span>
              <span className="text-slate-700">{absent} <span className="text-slate-400 font-medium ml-1">({absentPct}%)</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-rose-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${absentPct}%` }}
              />
            </div>
          </div>

          {/* Late Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-amber-600">Late</span>
              <span className="text-slate-700">{late} <span className="text-slate-400 font-medium ml-1">({latePct}%)</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${latePct}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
