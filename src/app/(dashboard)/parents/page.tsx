'use client';

import React, { useEffect, useState } from 'react';
import { parentsApi } from '@/lib/api/parents';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface Parent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  occupation: string;
  status: string;
  childrenCount?: number;
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadParents() {
      try {
        const response = await parentsApi.getAll();
        // Fallback to empty array if response.data is undefined, mapping realistically
        const mappedData: Parent[] = (response.data || []).map((p: any) => ({
          id: p.id,
          firstName: p.firstName || 'Unknown',
          lastName: p.lastName || '',
          email: p.email || 'N/A',
          contactNumber: p.contactNumber || 'N/A',
          occupation: p.occupation || 'N/A',
          status: 'Active',
          childrenCount: p.children ? p.children.length : 0,
        }));
        
        // If the backend returns no parents, show some dummy data for preview
        if (mappedData.length === 0) {
          setParents([
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', contactNumber: '555-0100', occupation: 'Engineer', status: 'Active', childrenCount: 2 },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', contactNumber: '555-0101', occupation: 'Doctor', status: 'Active', childrenCount: 1 },
          ]);
        } else {
          setParents(mappedData);
        }
      } catch (error) {
        console.error('Failed to load parents:', error);
        setParents([]);
      } finally {
        setLoading(false);
      }
    }
    loadParents();
  }, []);

  const filteredParents = parents.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.occupation.toLowerCase().includes(query)
    );
  });

  const columns: Column<Parent>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (p) => (
        <div className="font-semibold text-[#111827]">
          {p.firstName} {p.lastName}
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'contactNumber', header: 'Contact' },
    { key: 'occupation', header: 'Occupation' },
    { 
      key: 'childrenCount', 
      header: 'Children',
      render: (p) => <span className="font-medium text-[#4f46e5]">{p.childrenCount} Enrolled</span>
    },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Parents & Guardians</h1>
        <p className="text-sm text-[#6b7280]">Manage parent profiles and their linked children</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search parents by name, email, or occupation..."
        actionLabel="Add Parent"
        onAction={() => alert('Add Parent modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading parent records..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredParents}
          keyExtractor={(p) => p.id}
          emptyMessage="No parent records found."
        />
      )}
    </div>
  );
}
