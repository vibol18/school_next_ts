'use client';

import React, { useEffect, useState } from 'react';
import { sectionApi, classApi } from '@/lib/api';
import { Section, SchoolClass } from '@/types/school.types';

export default function SectionsPage() {
  const [sectionsList, setSectionsList] = useState<Section[]>([]);
  const [classesList, setClassesList] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<Omit<Section, 'id'>>({
    name: '',
    classId: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // We need both sections and classes for the UI
      const [secData, clsData] = await Promise.all([
        sectionApi.getAll(),
        classApi.getAll(),
      ]);
      setSectionsList(secData);
      setClassesList(clsData);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch sections or classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingSection(null);
    setFormData({ name: '', classId: classesList.length > 0 ? classesList[0].id : 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Section) => {
    setEditingSection(s);
    setFormData({
      name: s.name,
      classId: s.classId,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingSection) {
        await sectionApi.update(editingSection.id, formData);
      } else {
        await sectionApi.create(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save section.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      await sectionApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete section.');
    }
  };

  const getClassName = (classId: number) => {
    const c = classesList.find((cls) => cls.id === classId);
    return c ? c.name : `Unknown Class (${classId})`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sections</h1>
          <p className="text-sm text-slate-500">
            Manage sections (e.g. A, B, Alpha) linked to specific classes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center bg-[#5b51ef] hover:bg-[#4b41df] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Add Section
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
        ) : sectionsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No sections found. Click "Add Section" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Section Name</th>
                  <th className="px-6 py-3.5">Class</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionsList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{s.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                        {getClassName(s.classId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="text-xs text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingSection ? `Edit Section #${editingSection.id}` : 'Create Section'}
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
                <label className="block font-medium text-slate-700 mb-1">Section Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., A, Alpha, Blue"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Class</label>
                {classesList.length === 0 ? (
                  <div className="p-3 text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                    No classes available. Please create a class first.
                  </div>
                ) : (
                  <select
                    required
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition bg-white"
                  >
                    {!editingSection && formData.classId === 0 && (
                      <option value="0" disabled>
                        Select a Class
                      </option>
                    )}
                    {classesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  disabled={isSaving || classesList.length === 0 || formData.classId === 0}
                  className="px-4 py-2 bg-[#5b51ef] text-white rounded-md hover:bg-[#4b41df] disabled:opacity-50 transition font-medium"
                >
                  {isSaving ? 'Saving...' : editingSection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
