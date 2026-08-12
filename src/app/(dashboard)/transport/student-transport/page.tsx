'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface StudentTransport {
  id: number;
  studentName: string;
  admissionNo: string;
  routeName: string;
  stopName: string;
  fare: number;
}

export default function StudentTransportPage() {
  const [transportAllocations, setTransportAllocations] = useState<StudentTransport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setTransportAllocations([
        { id: 1, studentName: 'Alice Johnson', admissionNo: 'STU-001', routeName: 'Route 1 - City Center', stopName: 'North Square Gate', fare: 50 },
        { id: 2, studentName: 'Bob Smith', admissionNo: 'STU-002', routeName: 'Route 2 - Suburbs', stopName: 'West End Mall', fare: 65 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredAllocations = transportAllocations.filter((a) => {
    const query = search.toLowerCase();
    return (
      a.studentName.toLowerCase().includes(query) ||
      a.admissionNo.toLowerCase().includes(query) ||
      a.routeName.toLowerCase().includes(query)
    );
  });

  const columns: Column<StudentTransport>[] = [
    { key: 'studentName', header: 'Student Name', render: (a) => <span className="font-semibold text-[#111827]">{a.studentName}</span> },
    { key: 'admissionNo', header: 'Admission No.' },
    { key: 'routeName', header: 'Route' },
    { key: 'stopName', header: 'Pickup/Drop Stop' },
    { key: 'fare', header: 'Monthly Fare', render: (a) => <span className="font-medium text-[#16a34a]">${a.fare.toFixed(2)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium bg-[#fde2e2] px-2 py-1 rounded">
          Remove
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Student Transport</h1>
        <p className="text-sm text-[#6b7280]">Manage student transport assignments and pickup stops</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name, route, or stop..."
        actionLabel="Assign Transport"
        onAction={() => alert('Assign Transport modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading transport allocations..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAllocations}
          keyExtractor={(a) => a.id}
          emptyMessage="No student transport allocations found."
        />
      )}
    </div>
  );
}
