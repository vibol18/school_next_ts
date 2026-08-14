'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentApi } from '@/lib/api/assignments-management';
import { assignmentSubmissionApi } from '@/lib/api/assignments';
import { sectionsApi, subjectsApi } from '@/lib/api/academic';
import { submissionSchema, SubmissionFormData } from '@/lib/validators/assignment.schema';
import { AssignmentSubmission, CreateSubmissionInput } from '@/types/assignment.types';
import type { Section, Subject } from '@/types/school.types';
import { Badge } from '@/components/shared/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Link2,
  Paperclip,
  Upload,
} from 'lucide-react';

export default function AssignmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignmentId = parseInt(id, 10);

  const [assignment, setAssignment] = useState<{
    title: string;
    description?: string;
    dueDate?: string;
    fileUrl?: string;
    sectionId?: number;
    subjectId?: number;
  } | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Mocked active student ID (obtain from your auth store/session in production)
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

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignmentData, submissionData, sectionData, subjectData] = await Promise.all([
        assignmentApi.getById(assignmentId),
        assignmentSubmissionApi.getByAssignment(assignmentId),
        sectionsApi.getAll(),
        subjectsApi.getAll(),
      ]);
      setAssignment(assignmentData);
      setSubmissions(
        submissionData.filter(
          (s) => s.assignmentId === assignmentId && s.studentId === studentId
        )
      );
      setSections(sectionData);
      setSubjects(subjectData);
    } catch (err: any) {
      console.error('Failed to load assignment', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(assignmentId)) {
      loadData();
    }
  }, [assignmentId]);

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      const payload: CreateSubmissionInput = {
        assignmentId,
        studentId,
        fileUrl: data.fileUrl,
      };
      await assignmentSubmissionApi.submit(payload);
      reset();
      loadData();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading assignment..." />;

  if (!assignment) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          Assignment not found.
        </div>
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
      </div>
    );
  }

  const sectionName = sections.find((s) => s.id === assignment.sectionId)?.name;
  const subjectName = subjects.find((s) => s.id === assignment.subjectId)?.name;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Link
        href="/assignments"
        className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{assignment.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {sectionName && <Badge variant="slate">{sectionName}</Badge>}
                {subjectName && <Badge variant="indigo">{subjectName}</Badge>}
                {assignment.dueDate && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          {assignment.fileUrl && (
            <a
              href={assignment.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-white bg-[#5b51ef] hover:bg-[#4b42db] px-4 py-2 rounded-lg transition"
            >
              <Paperclip className="w-3.5 h-3.5" />
              View Attachment
            </a>
          )}
        </div>
        {assignment.description && (
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">{assignment.description}</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#111827]">Submit Solution</h2>
        {submitError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('assignmentId', { valueAsNumber: true })} />
          <input type="hidden" {...register('studentId', { valueAsNumber: true })} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              File/Drive URL
            </label>
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                {...register('fileUrl')}
                type="url"
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border rounded-md border-slate-300 focus:ring-2 focus:ring-[#5b51ef] text-sm outline-none"
              />
            </div>
            {errors.fileUrl && (
              <p className="text-rose-500 text-xs mt-1">{errors.fileUrl.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#5b51ef] hover:bg-[#4b42db] text-white font-medium px-4 py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Upload Submission'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-[#111827]">Your Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-slate-400">No submissions yet for this assignment.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2"
              >
                <div className="flex justify-between items-center text-sm">
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#5b51ef] hover:underline font-medium truncate max-w-xs"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    {sub.fileUrl}
                  </a>
                  <span className="text-xs text-slate-500">
                    {sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleString()
                      : 'Just now'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <Badge>{sub.status || 'SUBMITTED'}</Badge>
                  {sub.marks !== undefined && sub.marks !== null && (
                    <span className="font-semibold text-slate-700">
                      Marks: <span className="text-[#16a34a]">{sub.marks}</span>
                    </span>
                  )}
                </div>
                {sub.feedback && (
                  <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
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
