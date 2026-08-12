'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface Room {
  id: number;
  blockName: string;
  roomNumber: string;
  type: string;
  capacity: number;
  occupied: number;
}

export default function HostelRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Swap to real API call when backend is ready
    setTimeout(() => {
      setRooms([
        { id: 101, blockName: 'Alpha Block', roomNumber: 'A-101', type: '2-Seater', capacity: 2, occupied: 2 },
        { id: 102, blockName: 'Alpha Block', roomNumber: 'A-102', type: '2-Seater', capacity: 2, occupied: 1 },
        { id: 103, blockName: 'Beta Block', roomNumber: 'B-201', type: '3-Seater', capacity: 3, occupied: 0 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const query = search.toLowerCase();
    return (
      r.blockName.toLowerCase().includes(query) ||
      r.roomNumber.toLowerCase().includes(query)
    );
  });

  const columns: Column<Room>[] = [
    { key: 'roomNumber', header: 'Room No.', render: (r) => <span className="font-semibold text-[#111827]">{r.roomNumber}</span> },
    { key: 'blockName', header: 'Block' },
    { key: 'type', header: 'Room Type' },
    { key: 'occupancy', header: 'Occupancy', render: (r) => `${r.occupied} / ${r.capacity}` },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        if (r.occupied === r.capacity) return <Badge variant="red">Full</Badge>;
        if (r.occupied === 0) return <Badge variant="green">Available</Badge>;
        return <Badge variant="amber">Partially Filled</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Edit Room
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Hostel Rooms</h1>
        <p className="text-sm text-[#6b7280]">Manage individual rooms and their occupancy status</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search rooms by number or block..."
        actionLabel="Add Room"
        onAction={() => alert('Add Room modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading hostel rooms..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredRooms}
          keyExtractor={(r) => r.id}
          emptyMessage="No hostel rooms found."
        />
      )}
    </div>
  );
}
