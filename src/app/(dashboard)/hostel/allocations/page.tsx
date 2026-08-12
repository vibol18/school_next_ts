'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface Allocation {
  id: number;
  studentName: string;
  admissionNo: string;
  blockName: string;
  roomNumber: string;
  allocatedDate: string;
  status: string;
}

export default function HostelAllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Swap to real API call when backend is ready
    setTimeout(() => {
      setAllocations([
        { id: 1, studentName: 'Alice Johnson', admissionNo: 'STU-001', blockName: 'Beta Block', roomNumber: 'B-201', allocatedDate: '2024-01-15', status: 'Allocated' },
        { id: 2, studentName: 'Bob Smith', admissionNo: 'STU-002', blockName: 'Alpha Block', roomNumber: 'A-101', allocatedDate: '2024-01-16', status: 'Allocated' },
        { id: 3, studentName: 'Charlie Davis', admissionNo: 'STU-003', blockName: 'Alpha Block', roomNumber: 'A-102', allocatedDate: '2023-09-01', status: 'Vacated' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredAllocations = allocations.filter((a) => {
    const query = search.toLowerCase();
    return (
      a.studentName.toLowerCase().includes(query) ||
      a.admissionNo.toLowerCase().includes(query) ||
      a.roomNumber.toLowerCase().includes(query)
    );
  });

  const columns: Column<Allocation>[] = [
    { key: 'studentName', header: 'Student Name', render: (a) => <span className="font-semibold text-[#111827]">{a.studentName}</span> },
    { key: 'admissionNo', header: 'Admission No.' },
    { key: 'blockName', header: 'Block' },
    { key: 'roomNumber', header: 'Room No.' },
    { key: 'allocatedDate', header: 'Allocated On' },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <Badge>{a.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (a) => (
        <div className="flex gap-2">
          {a.status === 'Allocated' && (
            <button className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium bg-[#fde2e2] px-2 py-1 rounded">
              Vacate Room
            </button>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Hostel Allocations</h1>
        <p className="text-sm text-[#6b7280]">Manage student room assignments and vacating process</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name, admission no, or room..."
        actionLabel="Allocate Room"
        onAction={() => alert('Allocate Room modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading allocations..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAllocations}
          keyExtractor={(a) => a.id}
          emptyMessage="No hostel allocations found."
        />
      )}
    </div>
  );
}
