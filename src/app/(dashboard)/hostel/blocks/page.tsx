'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import { hostelApi } from '@/lib/api/hostel.api'; // Assuming an API file exists

interface Block {
  id: number;
  name: string;
  type: string;
  capacity: number;
  warden: string;
}

export default function HostelBlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Swap to real API call when backend is ready
    setTimeout(() => {
      setBlocks([
        { id: 1, name: 'Alpha Block', type: 'Boys', capacity: 120, warden: 'Mr. John Smith' },
        { id: 2, name: 'Beta Block', type: 'Girls', capacity: 100, warden: 'Mrs. Jane Doe' },
        { id: 3, name: 'Gamma Block', type: 'Boys', capacity: 80, warden: 'Mr. Robert Brown' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredBlocks = blocks.filter((b) => {
    const query = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.warden.toLowerCase().includes(query)
    );
  });

  const columns: Column<Block>[] = [
    { key: 'name', header: 'Block Name', render: (b) => <span className="font-semibold text-[#111827]">{b.name}</span> },
    { key: 'type', header: 'Type', render: (b) => <span className="text-slate-600 font-medium">{b.type}</span> },
    { key: 'capacity', header: 'Total Capacity' },
    { key: 'warden', header: 'Warden Name' },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Edit Block
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Hostel Blocks</h1>
        <p className="text-sm text-[#6b7280]">Manage hostel buildings and their capacities</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search blocks by name or warden..."
        actionLabel="Add Block"
        onAction={() => alert('Add Block modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading hostel blocks..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredBlocks}
          keyExtractor={(b) => b.id}
          emptyMessage="No hostel blocks found."
        />
      )}
    </div>
  );
}
