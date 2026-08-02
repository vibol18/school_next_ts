'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AssignmentForm from '@/components/domain/assignments/AssignmentForm';
import { assignmentApi } from '@/lib/api/assignments-management';
import { AssignmentCreateInput } from '@/types/assignment.types';
export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: AssignmentCreateInput) => {
    try {
      setLoading(true);
      await assignmentApi.create({
        ...data,
        fileUrl: data.fileUrl || undefined,
      });
      router.push('/assignments');
    } catch (err) {
      alert('Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Assignment</h1>
        <p className="text-sm text-slate-500">Post an assignment for a class section</p>
      </div>
      <AssignmentForm onSubmit={handleCreate} isLoading={loading} buttonText="Create Assignment" />
    </div>
  );
}