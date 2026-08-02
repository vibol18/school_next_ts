'use client';

import React, { useEffect, useState, use } from 'react';
import { teacherApi } from '@/lib/api/teachers';
import { TimetableSlot } from '@/types/teacher.types';

export default function TeacherTimetablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const teacherId = parseInt(id, 10);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimetable() {
      try {
        const data = await teacherApi.getTimetable(teacherId);
        setTimetable(data);
      } catch (err) {
        console.error('Failed to load timetable', err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, [teacherId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Teacher Weekly Timetable</h1>

      {loading ? (
        <div className="text-gray-500">Loading schedule...</div>
      ) : timetable.length === 0 ? (
        <div className="bg-white p-8 rounded-md border text-center text-gray-500">
          No scheduled classes found for this teacher.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timetable.map((slot) => (
            <div key={slot.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                {slot.dayOfWeek}
              </span>
              <h3 className="font-bold text-gray-800">{slot.subjectName}</h3>
              <p className="text-xs text-gray-500">
                Class: {slot.className} - {slot.sectionName}
              </p>
              <p className="text-xs font-mono text-gray-600">
                {slot.startTime} - {slot.endTime}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}