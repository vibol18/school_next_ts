"use client";

import React, { useState, useEffect } from "react";
import { Clock, User } from "lucide-react";

// Flexible Interface to map to your API response schema
export interface ScheduleItem {
  id?: string | number;
  day: string; // e.g. "Monday"
  timeSlot?: string; // e.g. "09:00 - 09:45 AM"
  startTime?: string;
  endTime?: string;
  subjectName?: string;
  subject?: string;
  teacherName?: string;
  teacher?: string;
  teacherAvatar?: string;
  [key: string]: any;
}

const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Pastel palette for cards
const PASTEL_PALETTES = [
  "bg-pink-50/70 border-pink-100",
  "bg-cyan-50/70 border-cyan-100",
  "bg-emerald-50/70 border-emerald-100",
  "bg-amber-50/70 border-amber-100",
  "bg-indigo-50/70 border-indigo-100",
  "bg-purple-50/70 border-purple-100",
];

function getSubjectColor(subjectName: string = ""): string {
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_PALETTES.length;
  return PASTEL_PALETTES[index];
}

export default function TimetablePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClass, setSelectedClass] = useState("Class I-A");

  useEffect(() => {
    async function fetchTimetable() {
      try {
        setLoading(true);
        // Replace with your endpoint:
        // const response = await fetch('/api/timetable');
        // const data = await response.json();
        // setSchedule(data);
        
        setSchedule([]); // Populated via your API
      } catch (error) {
        console.error("Failed to load timetable:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimetable();
  }, []);

  const breaks = [
    { title: "Morning Break", time: "10:30 to 10:45 AM", badgeBg: "bg-blue-600" },
    { title: "Lunch", time: "10:30 to 10:45 AM", badgeBg: "bg-amber-500" },
    { title: "Evening Break", time: "03:30 PM to 03:45 PM", badgeBg: "bg-blue-600" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-bold text-slate-800">Time Table</h1>

        <div className="flex items-center gap-3">
          {/* Class Filter Dropdown */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Class I-A">🎓 Class I-A</option>
            <option value="Class I-B">🎓 Class I-B</option>
            <option value="Class II-A">🎓 Class II-A</option>
          </select>

          {/* Week Filter Dropdown */}
          <select className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="This Week">📅 This Week</option>
            <option value="Next Week">📅 Next Week</option>
          </select>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      {loading ? (
        <div className="w-full flex items-center justify-center p-16 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading timetable...</p>
          </div>
        </div>
      ) : schedule.length === 0 ? (
        <div className="w-full flex items-center justify-center p-16 bg-white rounded-xl border border-slate-100 shadow-2xs">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No schedule found</h3>
              <p className="text-slate-400 text-xs mt-0.5">No classes scheduled for the selected class/week.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {DEFAULT_DAYS.map((day) => {
            const daySchedule = schedule
              .filter((item) => item.day?.toLowerCase() === day.toLowerCase())
              .sort((a, b) => {
                const timeA = a.timeSlot || a.startTime || "";
                const timeB = b.timeSlot || b.startTime || "";
                return timeA.localeCompare(timeB);
              });

            return (
              <div key={day} className="flex flex-col space-y-3">
                <h3 className="font-bold text-slate-800 text-xs px-1 py-1">{day}</h3>

                {daySchedule.length > 0 ? (
                  daySchedule.map((item, idx) => {
                    const subject = item.subjectName || item.subject || "Subject";
                    const teacher = item.teacherName || item.teacher || "TBA";
                    const time =
                      item.timeSlot ||
                      (item.startTime && item.endTime
                        ? `${item.startTime} - ${item.endTime}`
                        : "09:00 - 09:45 AM");

                    const cardStyle = getSubjectColor(subject);

                    return (
                      <div
                        key={item.id || `${day}-${idx}`}
                        className={`p-3.5 rounded-xl border ${cardStyle} transition-all hover:shadow-2xs flex flex-col justify-between gap-3`}
                      >
                        <div>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{time}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-xs tracking-tight">
                            Subject : <span className="font-semibold">{subject}</span>
                          </h4>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1.5 px-2.5 flex items-center gap-2 border border-slate-100 shadow-2xs max-w-fit">
                          <div className="w-6 h-6 rounded-md bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.teacherAvatar ? (
                              <img src={item.teacherAvatar} alt={teacher} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">
                            {teacher}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-24 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs font-medium text-slate-300">
                    No Classes
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Bottom Break Cards Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
        {breaks.map((b, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col gap-2">
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-md max-w-fit uppercase ${b.badgeBg}`}>
              {b.title}
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{b.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}