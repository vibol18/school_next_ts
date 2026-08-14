'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { assignmentApi } from '@/lib/api/assignments-management';
import { sectionsApi, subjectsApi } from '@/lib/api/academic';
import type { Section, Subject } from '@/types/school.types';
import { Assignment, AssignmentCreateInput } from '@/types/assignment.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import { FileText, ClipboardList, Paperclip } from 'lucide-react';

const toDateOnly = (value?: string) => (value ? value.slice(0, 10) : value);

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, sectionData, subjectData] = await Promise.all([
        assignmentApi.getAll(),
        sectionsApi.getAll(),
        subjectsApi.getAll(),
      ]);
      setAssignments(data);
      setSections(sectionData);
      setSubjects(subjectData);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch assignments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const sectionName = (id?: number) => sections.find((s) => s.id === id)?.name;
  const subjectName = (id?: number) => subjects.find((s) => s.id === id)?.name;

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete assignment #${id}?`)) return;

    try {
      await assignmentApi.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(
        err?.message ||
          'Failed to delete assignment. Ensure there are no student submissions attached to it.'
      );
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    try {
      setIsSaving(true);
      const payload: AssignmentCreateInput = {
        title: editingAssignment.title,
        description: editingAssignment.description,
        dueDate: toDateOnly(editingAssignment.dueDate),
        fileUrl: editingAssignment.fileUrl || undefined,
        sectionId: Number(editingAssignment.sectionId),
        subjectId: Number(editingAssignment.subjectId),
      };

      await assignmentApi.update(editingAssignment.id, payload);
      setEditingAssignment(null);
      await loadAssignments();
    } catch (err: any) {
      alert(err?.message || 'Failed to update assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (a) =>
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sectionName(a.sectionId) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subjectName(a.subjectId) || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Assignment>[] = [
    {
      key: 'title',
      header: 'Assignment',
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-[#111827]">{a.title}</div>
            <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">
              {a.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'section',
      header: 'Section / Subject',
      render: (a) => (
        <div className="flex flex-wrap gap-1.5">
          {sectionName(a.sectionId) ? (
            <Badge variant="slate">{sectionName(a.sectionId)}</Badge>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
          {subjectName(a.subjectId) ? (
            <Badge variant="indigo">{subjectName(a.subjectId)}</Badge>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (a) => (
        <span className="text-xs text-slate-600">
          {a.dueDate
            ? (() => {
                const d = new Date(a.dueDate);
                return isNaN(d.getTime())
                  ? a.dueDate
                  : d.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
              })()
            : '—'}
        </span>
      ),
    },
    {
      key: 'fileUrl',
      header: 'Attachment',
      render: (a) =>
        a.fileUrl ? (
          <a
            href={a.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#5b51ef] hover:underline font-medium"
          >
            <Paperclip className="w-3.5 h-3.5" />
            View File
          </a>
        ) : (
          <span className="text-slate-300 text-xs">None</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (a) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/assignments/${a.id}`}
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <ClipboardList className="w-3 h-3" />
            Details
          </Link>
          <Link
            href={`/assignments/${a.id}/submissions`}
            className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            Submissions
          </Link>
          <button
            onClick={() => setEditingAssignment(a)}
            className="text-xs text-[#4f46e5] hover:text-[#4338ca] bg-[#e5e5fa] px-2.5 py-1.5 rounded-md font-medium transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(a.id)}
            className="text-xs text-rose-600 hover:text-rose-900 bg-rose-50 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Assignments</h1>
          <p className="text-sm text-slate-500">
            Manage, edit, and track coursework assigned across sections
          </p>
        </div>
        <Link
          href="/assignments/new"
          className="inline-flex items-center justify-center bg-[#5b51ef] hover:bg-[#4b42db] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Create Assignment
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <ListToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title, description, section, or subject..."
      />

      {loading ? (
        <LoadingSpinner text="Loading assignments..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAssignments}
          keyExtractor={(a) => a.id}
          emptyMessage={
            searchQuery
              ? `No assignments match "${searchQuery}".`
              : 'No assignments found. Click "Create Assignment" to add one.'
          }
        />
      )}

      {editingAssignment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#111827]">
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Section</label>
                  <select
                    required
                    value={editingAssignment.sectionId ?? ''}
                    onChange={(e) =>
                      setEditingAssignment({
                        ...editingAssignment,
                        sectionId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none bg-white"
                  >
                    <option value="" disabled>
                      Select section
                    </option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject</label>
                  <select
                    required
                    value={editingAssignment.subjectId ?? ''}
                    onChange={(e) =>
                      setEditingAssignment({
                        ...editingAssignment,
                        subjectId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none bg-white"
                  >
                    <option value="" disabled>
                      Select subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={toDateOnly(editingAssignment.dueDate) || ''}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none"
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
                  className="px-4 py-2 bg-[#5b51ef] text-white rounded-md hover:bg-[#4b42db] disabled:opacity-50 transition font-medium"
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
