'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Event {
  id: number;
  title: string;
  eventDate: string;
  location: string;
  organizer: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setEvents([
        { id: 1, title: 'Science Fair 2024', eventDate: '2024-04-15 10:00 AM', location: 'Main Auditorium', organizer: 'Science Dept' },
        { id: 2, title: 'Parent-Teacher Meeting', eventDate: '2024-04-20 02:00 PM', location: 'Classrooms', organizer: 'Admin' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredEvents = events.filter((e) => {
    const query = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.organizer.toLowerCase().includes(query)
    );
  });

  const columns: Column<Event>[] = [
    { key: 'title', header: 'Event Title', render: (e) => <span className="font-semibold text-[#111827]">{e.title}</span> },
    { key: 'eventDate', header: 'Date & Time' },
    { key: 'location', header: 'Location' },
    { key: 'organizer', header: 'Organizer' },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Edit
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Events</h1>
        <p className="text-sm text-[#6b7280]">Manage upcoming school events and activities</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events by title, location, or organizer..."
        actionLabel="Create Event"
        onAction={() => alert('Create Event modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredEvents}
          keyExtractor={(e) => e.id}
          emptyMessage="No events found."
        />
      )}
    </div>
  );
}
