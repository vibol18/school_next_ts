'use client';

import React, { useEffect, useState } from 'react';
import { academicYearApi } from '@/lib/api';
import { AcademicYear } from '@/types/school.types';

export default function AcademicYearsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState<Omit<AcademicYear, 'id'>>({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await academicYearApi.getAll();
      setAcademicYears(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch academic years.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingYear(null);
    setFormData({ name: '', startDate: '', endDate: '', isCurrent: false });
    setIsModalOpen(true);
  };

  const openEditModal = (year: AcademicYear) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      startDate: year.startDate.split('T')[0], // format date for input
      endDate: year.endDate.split('T')[0],
      isCurrent: year.isCurrent,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingYear) {
        await academicYearApi.update(editingYear.id, formData);
      } else {
        await academicYearApi.create(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save academic year.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetCurrent = async (id: number) => {
    if (!confirm('Are you sure you want to set this as the current academic year?')) return;
    try {
      await academicYearApi.setCurrent(id);
      await loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to set current year.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Years</h1>
          <p className="text-sm text-slate-500">
            Manage school periods, terms, and set the active academic year.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center bg-[#5b51ef] hover:bg-[#4b41df] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          + Add Academic Year
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
        ) : academicYears.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No academic years found. Click "Add Academic Year" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Year Name</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicYears.map((year) => (
                  <tr key={year.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{year.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{year.name}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(year.startDate).toLocaleDateString()} -{' '}
                      {new Date(year.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {year.isCurrent ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Active Current Year
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!year.isCurrent && (
                        <button
                          onClick={() => handleSetCurrent(year.id)}
                          className="text-xs text-emerald-600 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-md font-medium transition"
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(year)}
                        className="text-xs text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1.5 rounded-md font-medium transition"
                      >
                        Edit
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
                {editingYear ? `Edit Academic Year #${editingYear.id}` : 'Create Academic Year'}
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
                <label className="block font-medium text-slate-700 mb-1">Year Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 2026-2027"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                  />
                </div>
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
                  {isSaving ? 'Saving...' : editingYear ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
