'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherForm from '@/components/domain/teachers/TeacherForm';
import { teacherApi } from '@/lib/api/teachers';
import { TeacherFormData } from '@/lib/validators/teacher.schema';

export default function NewTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: TeacherFormData) => {
    const payload = {
      employeeId: data.employeeId.trim(),
      qualification: data.qualification.trim(),
      experienceYears: data.experienceYears.trim(),
      dateOfJoining: data.dateOfJoining.trim(),
      profilePhoto: data.profilePhoto || null,
    };

    try {
      setLoading(true);
      await teacherApi.create(payload);
      router.push('/teachers');
    } catch (err) {
      alert('Error creating teacher record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Register New Teacher</h1>
      <TeacherForm onSubmit={handleCreate} isLoading={loading} buttonText="Register Teacher" />
    </div>
  );
}