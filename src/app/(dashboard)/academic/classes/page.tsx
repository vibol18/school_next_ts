'use client';

import React, { useEffect, useState } from 'react';
import { classApi } from '@/lib/api';
import { SchoolClass } from '@/types/school.types';
import { Pagination } from '@/components/shared/Pagination';
import { usePagination } from '@/lib/hooks/usePagination';

export default function ClassesPage() {
  const [classesList, setClassesList] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { page, setPage, pagedItems, totalItems } = usePagination(classesList);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [formData, setFormData] = useState<Omit<SchoolClass, 'id'>>({
    name: '',
    code: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classApi.getAll();
      setClassesList(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingClass(null);
    setFormData({ name: '', code: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (c: SchoolClass) => {
    setEditingClass(c);
    setFormData({
      name: c.name,
      code: c.code || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingClass) {
        await classApi.update(editingClass.id, formData);
      } else {
        await classApi.create(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save class.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this class? All associated sections may be affected.')) return;
    try {
      await classApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete class.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
          <p className="text-sm text-slate-500">
            Manage school classes and their academic levels.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center bg-[#5b51ef] hover:bg-[#4b41df] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Add Class
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading data...</div>
        ) : classesList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No classes found. Click "Add Class" to create one.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-6 py-3.5">Class Name</th>
                    <th className="px-6 py-3.5">Code</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedItems.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{c.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-6 py-4">
                      {c.code ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-600">
                          {c.code}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-xs text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
            <Pagination page={page} pageSize={10} totalItems={totalItems} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingClass ? `Edit Class #${editingClass.id}` : 'Create Class'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Grade 10, Freshman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Class Code</label>
                <input
                  type="text"
                  placeholder="e.g., G10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#5b51ef] text-white rounded-md hover:bg-[#4b41df] disabled:opacity-50 transition font-medium"
                >
                  {isSaving ? 'Saving...' : editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}