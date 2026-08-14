'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import TeacherForm from '@/components/domain/teachers/TeacherForm';
import { teacherApi } from '@/lib/api/teachers';
import { TeacherFormData } from '@/lib/validators/teacher.schema';

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const teacherId = parseInt(id, 10);
  const router = useRouter();

  const [initialData, setInitialData] = useState<TeacherFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        setLoading(true);
        const teacher = await teacherApi.getById(teacherId);
        
        setInitialData({
          employeeId: teacher.employeeId,
          qualification: teacher.qualification,
          experienceYears: String(teacher.experienceYears),
          dateOfJoining: teacher.dateOfJoining,
          profilePhoto: teacher.profilePhoto || '',
        });
      } catch (err) {
        setError('Failed to load teacher information.');
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(teacherId)) {
      loadTeacherData();
    } else {
      setError('Invalid teacher ID provided.');
      setLoading(false);
    }
  }, [teacherId]);

  const handleUpdate = async (data: TeacherFormData) => {
    try {
      setSubmitting(true);
      await teacherApi.update(teacherId, data);
      router.push('/teachers');
    } catch (err) {
      alert('Error updating teacher record.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading teacher details...</div>;
  }

  if (error || !initialData) {
    return <div className="p-6 text-red-500">{error || 'Unable to load teacher data.'}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Edit Teacher</h1>
        <p className="text-sm text-gray-500">Update administrative details for Teacher #{teacherId}</p>
      </div>

      <TeacherForm
        initialValues={initialData}
        onSubmit={handleUpdate}
        isLoading={submitting}
        buttonText="Update Teacher"
      />
    </div>
  );
}