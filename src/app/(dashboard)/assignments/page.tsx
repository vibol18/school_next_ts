'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { assignmentApi } from '@/lib/api/assignments-management';
import { Assignment, AssignmentCreateInput } from '@/types/assignment.types';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Edit Modal State
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch initial list
  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentApi.getAll();
      setAssignments(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Delete Assignment Handler
  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete assignment #${id}?`)) return;

    try {
      await assignmentApi.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          'Failed to delete assignment. Ensure there are no student submissions attached to it.'
      );
    }
  };

  // Update Assignment Handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    try {
      setIsSaving(true);
      const payload: AssignmentCreateInput = {
        title: editingAssignment.title,
        description: editingAssignment.description,
        dueDate: editingAssignment.dueDate,
        fileUrl: editingAssignment.fileUrl || undefined,
        sectionId: Number(editingAssignment.sectionId),
        subjectId: Number(editingAssignment.subjectId),
      };

      await assignmentApi.update(editingAssignment.id, payload);
      setEditingAssignment(null);
      await loadAssignments();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-sm text-slate-500">
            Manage, edit, and track coursework assigned across sections
          </p>
        </div>
        <Link
          href="/assignments/new"
          className="inline-flex items-center justify-center bg-[#5b51ef] hover:bg-[#4b41df] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Create Assignment
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search assignments by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
        />
        <span className="text-xs text-slate-400 font-medium">
          Total: {filteredAssignments.length}
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No assignments found. Click "Create Assignment" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Section / Subject</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Attachment</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      #{assignment.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{assignment.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                        {assignment.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded mr-1">
                        Sec: {assignment.sectionId}
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                        Sub: {assignment.subjectId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(assignment.dueDate).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {assignment.fileUrl ? (
                        <a
                          href={assignment.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#5b51ef] hover:underline font-medium"
                        >
                          View File
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/assignments/${assignment.id}/submissions`}
                        className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Submissions
                      </Link>
                      <button
                        onClick={() => setEditingAssignment(assignment)}
                        className="text-xs text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-xs text-rose-600 hover:text-rose-900 bg-rose-50 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Edit Assignment #{editingAssignment.id}
              </h2>
              <button
                onClick={() => setEditingAssignment(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingAssignment.title}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingAssignment.description}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Section ID</label>
                  <input
                    type="number"
                    required
                    value={editingAssignment.sectionId}
                    onChange={(e) =>
                      setEditingAssignment({
                        ...editingAssignment,
                        sectionId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject ID</label>
                  <input
                    type="number"
                    required
                    value={editingAssignment.subjectId}
                    onChange={(e) =>
                      setEditingAssignment({
                        ...editingAssignment,
                        subjectId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  required
                  value={
                    editingAssignment.dueDate
                      ? new Date(editingAssignment.dueDate).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingAssignment.fileUrl || ''}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, fileUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#5b51ef] text-white rounded-md hover:bg-[#4b41df] disabled:opacity-50 transition font-medium"
                >
                  {isSaving ? 'Saving...' : 'Update Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}