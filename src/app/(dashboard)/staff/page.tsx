'use client';

import React, { useEffect, useState } from 'react';
import { staffApi } from '@/lib/api/staff.api';
import type { Staff } from '@/types/api.types';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadStaff() {
      try {
        const data = await staffApi.getAll();
        setStaff(data);
      } catch (error) {
        console.error('Failed to load staff:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  const filteredStaff = staff.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query) ||
      s.jobTitle.toLowerCase().includes(query)
    );
  });

  const columns: Column<Staff>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (s) => (
        <div className="font-semibold text-[#111827]">
          {s.firstName} {s.lastName}
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'department', header: 'Department' },
    { key: 'jobTitle', header: 'Role' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      render: () => 'Active', // Mocking status since it's not in the Staff interface
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Staff Directory</h1>
        <p className="text-sm text-[#6b7280]">Manage non-teaching staff across departments</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search staff by name, department, or role..."
        actionLabel="Add Staff"
        onAction={() => alert('Add Staff modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading staff records..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredStaff}
          keyExtractor={(s) => s.id}
          emptyMessage="No staff members found."
        />
      )}
    </div>
  );
}
