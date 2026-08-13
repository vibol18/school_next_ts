'use client';

import React, { useEffect, useState } from 'react';
import { eventApi } from '@/lib/api/communication.api';
import type { Event } from '@/types/api.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CalendarDays, MapPin, User, Pencil, Trash2 } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    organizer: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventApi.getAll();
      setEvents(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ title: '', description: '', eventDate: '', location: '', organizer: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (e: Event) => {
    setEditingEvent(e);
    setFormData({
      title: e.title,
      description: e.description || '',
      eventDate: (e.eventDate || '').split('T')[0],
      location: e.location,
      organizer: e.organizer,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingEvent) {
        await eventApi.update(editingEvent.id, formData);
      } else {
        await eventApi.create(formData);
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventApi.delete(id);
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete event.');
    }
  };

  const filteredEvents = events.filter((e) => {
    const query = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(query) ||
      e.location?.toLowerCase().includes(query) ||
      e.organizer?.toLowerCase().includes(query)
    );
  });

  const columns: Column<Event>[] = [
    {
      key: 'title',
      header: 'Event Title',
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#5b51ef]/10 text-[#5b51ef] flex items-center justify-center shrink-0">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[#111827] truncate">{e.title}</div>
            {e.description && (
              <div className="text-xs text-slate-400 truncate max-w-[320px]">{e.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'eventDate',
      header: 'Date',
      render: (e) => {
        const d = new Date(e.eventDate);
        return !isNaN(d.getTime()) ? (
          <span className="text-slate-600">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      key: 'location',
      header: 'Location',
      render: (e) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {e.location || '—'}
        </span>
      ),
    },
    {
      key: 'organizer',
      header: 'Organizer',
      render: (e) => (
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <User className="w-3.5 h-3.5 text-slate-400" />
          {e.organizer || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (e) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(e)}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(e.id)}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-md font-medium transition"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Events</h1>
        <p className="text-sm text-[#6b7280]">Manage upcoming school events and activities</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events by title, location, or organizer..."
        actionLabel="Create Event"
        onAction={openCreateModal}
      />

      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredEvents}
          keyExtractor={(e) => e.id}
          emptyMessage="No events found. Click 'Create Event' to add one."
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                {editingEvent ? 'Edit Event' : 'Create Event'}
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
                <label className="block font-medium text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual Sports Day"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of the event"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Main Auditorium"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#5b51ef] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Organizer</label>
                <input
                  type="text"
                  placeholder="e.g., Science Department"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
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
                  {isSaving ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
