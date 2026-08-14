'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AssignmentForm, { AssignmentFormValues } from '@/components/domain/assignments/AssignmentForm';
import { assignmentApi } from '@/lib/api/assignments-management';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: AssignmentFormValues) => {
    try {
      setLoading(true);
      setError(null);
      await assignmentApi.create({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        fileUrl: data.fileUrl || undefined,
        sectionId: data.sectionId,
        subjectId: data.subjectId,
      });
      router.push('/assignments');
    } catch (err: any) {
      setError(err?.message || 'Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Create New Assignment</h1>
        <p className="text-sm text-slate-500">Post an assignment for a class section</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <AssignmentForm onSubmit={handleCreate} isLoading={loading} buttonText="Create Assignment" />
    </div>
  );
}
