'use client';

import React, { useEffect, useState, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSubmissionApi } from '@/lib/api/assignments';
import { submissionSchema, SubmissionFormData } from '@/lib/validators/assignment.schema';
import { AssignmentSubmission, CreateSubmissionInput } from '@/types/assignment.types';

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignmentId = parseInt(id, 10);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mocked active student ID (In practice, obtain this from your auth store/session)
  const studentId = 1;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      assignmentId,
      studentId,
      fileUrl: '',
    },
  });

  const loadStudentSubmissions = async () => {
    try {
      setLoading(true);
      const data = await assignmentSubmissionApi.getByStudent(studentId);
      // Filter for current assignment
      setSubmissions(data.filter((s) => s.assignmentId === assignmentId));
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(assignmentId)) {
      loadStudentSubmissions();
    }
  }, [assignmentId]);

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      setSubmitting(true);
      const payload: CreateSubmissionInput = {
        assignmentId,
        studentId,
        fileUrl: data.fileUrl,
      };
      await assignmentSubmissionApi.submit(payload);
      reset();
      loadStudentSubmissions();
    } catch (err) {
      alert('Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assignment #{assignmentId}</h1>
        <p className="text-sm text-gray-500">Submit your work link below</p>
      </div>

      {/* Submission Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Submit Solution</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('assignmentId', { valueAsNumber: true })} />
          <input type="hidden" {...register('studentId', { valueAsNumber: true })} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File/Drive URL</label>
            <input
              {...register('fileUrl')}
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.fileUrl && <p className="text-red-500 text-xs mt-1">{errors.fileUrl.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Upload Submission'}
          </button>
        </form>
      </div>

      {/* Submission History */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Your Submissions</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading history...</p>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-gray-400">No submissions found for this assignment.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 rounded-md border border-gray-100 bg-gray-50 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-medium truncate max-w-xs"
                  >
                    {sub.fileUrl}
                  </a>
                  <span className="text-xs text-gray-500">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-600">Status:</span>{' '}
                    <span className="uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {sub.status || 'SUBMITTED'}
                    </span>
                  </div>
                  {sub.marks !== undefined && sub.marks !== null && (
                    <div>
                      <span className="font-semibold text-gray-600">Marks:</span>{' '}
                      <span className="font-bold text-green-600">{sub.marks}</span>
                    </div>
                  )}
                </div>
                {sub.feedback && (
                  <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                    <span className="font-semibold">Feedback:</span> {sub.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}