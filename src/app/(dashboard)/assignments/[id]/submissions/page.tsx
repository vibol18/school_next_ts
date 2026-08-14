'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { assignmentApi } from '@/lib/api/assignments-management';
import { assignmentSubmissionApi } from '@/lib/api/assignments';
import { studentsApi } from '@/lib/api/students';
import { AssignmentSubmission } from '@/types/assignment.types';
import { Badge } from '@/components/shared/Badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Pagination } from '@/components/shared/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';
import { ArrowLeft, ClipboardCheck, ExternalLink, GraduationCap, Paperclip } from 'lucide-react';

interface StudentRow {
  id: number;
  firstName?: string;
  lastName?: string;
}

export default function TeacherSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignmentId = parseInt(id, 10);

  const [assignmentTitle, setAssignmentTitle] = useState<string>('');
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [marks, setMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const { page, setPage, pagedItems, totalItems } = usePagination(submissions);

  const studentName = (studentId?: number) => {
    const s = students.find((st) => st.id === studentId);
    return s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() || `Student #${studentId}` : undefined;
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, studentData, assignment] = await Promise.all([
        assignmentSubmissionApi.getByAssignment(assignmentId),
        studentsApi.getAll(),
        assignmentApi.getById(assignmentId),
      ]);
      setSubmissions(data);
      setStudents(studentData);
      setAssignmentTitle(assignment.title || '');
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch assignment submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNaN(assignmentId)) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setSelectedSub(sub);
    setMarks(sub.marks || 0);
    setFeedback(sub.feedback || '');
    setGradeError(null);
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      setGrading(true);
      setGradeError(null);
      await assignmentSubmissionApi.grade(selectedSub.id, { marks, feedback });
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err: any) {
      setGradeError(err?.message || 'Failed to save grade.');
    } finally {
      setGrading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading submissions..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/assignments"
            className="inline-flex items-center gap-2 text-sm text-[#5b51ef] font-medium hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Assignment Submissions</h1>
          <p className="text-sm text-slate-500">
            {assignmentTitle ? `${assignmentTitle} — review and grade submitted work` : `Review submissions for Assignment #${assignmentId}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b border-slate-200 tracking-wide">
            <tr>
              <th className="px-6 py-3 font-semibold">Student</th>
              <th className="px-6 py-3 font-semibold">File Link</th>
              <th className="px-6 py-3 font-semibold">Submitted At</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Marks</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedItems.map((sub) => {
              const name = studentName(sub.studentId);
              return (
                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{name || `Student #${sub.studentId}`}</div>
                        <div className="text-xs text-slate-400">ID: {sub.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#5b51ef] underline text-xs max-w-[200px] truncate"
                    >
                      <Paperclip className="w-3 h-3 shrink-0" />
                      {sub.fileUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{sub.status || 'SUBMITTED'}</Badge>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {sub.marks !== undefined && sub.marks !== null ? sub.marks : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenGradeModal(sub)}
                      className="inline-flex items-center gap-1.5 bg-[#5b51ef] hover:bg-[#4b42db] text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      Grade
                    </button>
                  </td>
                </tr>
              );
            })}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <ExternalLink className="w-6 h-6 text-slate-300" />
                    No submissions yet for this assignment.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} pageSize={10} totalItems={totalItems} onPageChange={setPage} />
      </div>

      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#111827]">
                Grade {studentName(selectedSub.studentId) || `Submission #${selectedSub.id}`}
              </h2>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              {gradeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
                  {gradeError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marks</label>
                <input
                  type="number"
                  step="0.1"
                  value={marks}
                  onChange={(e) => setMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] text-sm outline-none"
                  placeholder="Optional comments..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className="px-4 py-2 bg-[#5b51ef] text-white rounded-md text-sm hover:bg-[#4b42db] disabled:opacity-50"
                >
                  {grading ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
