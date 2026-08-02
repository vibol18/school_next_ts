import React from "react";
import { Clock, Book, User } from "lucide-react";

interface TimetableGridProps {
  schedule: any[];
  days?: string[];
  timeSlots?: string[];
}

const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_TIMES = ["08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "10:30 AM - 11:30 AM", "11:30 AM - 12:30 PM", "01:30 PM - 02:30 PM"];

export function TimetableGrid({ schedule, days = DEFAULT_DAYS, timeSlots = DEFAULT_TIMES }: TimetableGridProps) {
  
  // Helper to find class for a specific day and time
  const getClass = (day: string, time: string) => {
    if (!schedule) return null;
    return schedule.find(s => s.day === day && s.timeSlot === time);
  };

  if (!schedule || schedule.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No timetable available</h3>
            <p className="text-slate-500 text-sm mt-1">There are no classes scheduled for this view.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="bg-slate-900 text-white p-4 border-r border-slate-800 text-center w-32">
                <Clock className="w-5 h-5 mx-auto opacity-70" />
              </th>
              {days.map((day, idx) => (
                <th key={idx} className="bg-slate-800 text-white p-4 text-center text-sm font-bold uppercase tracking-wider border-r border-slate-700/50 last:border-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIdx) => {
              // Usually the break time is around the 3rd slot
              const isBreak = timeIdx === 2 && time.includes("10:30");
              
              if (isBreak) {
                return (
                  <tr key={timeIdx}>
                    <td className="bg-slate-50 border-r border-b border-slate-100 p-3 text-xs font-bold text-slate-500 text-center uppercase tracking-wider w-32">
                      {time}
                    </td>
                    <td colSpan={days.length} className="bg-slate-100/50 border-b border-slate-100 p-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                        Break Time
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={timeIdx}>
                  <td className="bg-slate-50 border-r border-b border-slate-100 p-3 text-xs font-bold text-slate-500 text-center uppercase tracking-wider w-32">
                    {time}
                  </td>
                  {days.map((day, dayIdx) => {
                    const cls = getClass(day, time);
                    return (
                      <td key={dayIdx} className="border-r border-b border-slate-100 p-2 h-24 min-w-[140px] last:border-r-0 hover:bg-slate-50 transition-colors">
                        {cls ? (
                          <div className={`h-full rounded-xl p-3 border ${cls.color || 'bg-indigo-50 border-indigo-100 text-indigo-900'} shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden`}>
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                            <div>
                              <p className="font-bold text-sm leading-tight group-hover:text-indigo-600 transition-colors">{cls.subjectName}</p>
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mt-1 uppercase">
                                <Book className="w-3 h-3" /> Room {cls.room || "101"}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                <User className="w-3 h-3 text-slate-400" />
                              </div>
                              <p className="text-xs font-medium text-slate-600 truncate">{cls.teacherName || "TBA"}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-slate-300">FREE</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
