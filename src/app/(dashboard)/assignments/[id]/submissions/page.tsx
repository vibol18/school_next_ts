'use client';

import React, { useEffect, useState, use } from 'react';
import { assignmentSubmissionApi } from '@/lib/api/assignments';
import { AssignmentSubmission } from '@/types/assignment.types';

export default function TeacherSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assignmentId = parseInt(id, 10);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected submission for grading
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [marks, setMarks] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [grading, setGrading] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await assignmentSubmissionApi.getByAssignment(assignmentId);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch assignment submissions', err);
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
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      setGrading(true);
      await assignmentSubmissionApi.grade(selectedSub.id, { marks, feedback });
      setSelectedSub(null);
      fetchSubmissions();
    } catch (err) {
      alert('Failed to save grade.');
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignment Submissions</h1>
          <p className="text-sm text-gray-500">Review and grade submitted work for Assignment #{assignmentId}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading submissions...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
              <tr>
                <th className="px-6 py-3">Submission ID</th>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">File Link</th>
                <th className="px-6 py-3">Submitted At</th>
                <th className="px-6 py-3">Marks</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{sub.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">Student #{sub.studentId}</td>
                  <td className="px-6 py-4">
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      View Submission
                    </a>
                  </td>
                  <td className="px-6 py-4 text-xs">{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {sub.marks !== undefined && sub.marks !== null ? sub.marks : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenGradeModal(sub)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded transition"
                    >
                      Grade
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No submissions found for this assignment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-gray-800">Grade Submission #{selectedSub.id}</h2>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                <input
                  type="number"
                  step="0.1"
                  value={marks}
                  onChange={(e) => setMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Optional comments..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
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