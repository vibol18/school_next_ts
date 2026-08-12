'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { feeCategoryApi } from '@/lib/api/fee.api';
import type { FeeCategory } from '@/types/api.types';

export default function FeeCategoriesPage() {
  const [categories, setCategories] = useState<FeeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await feeCategoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load fee categories:', error);
        // Fallback mock data
        setCategories([
          { id: 1, name: 'Tuition Fee', amount: 500, description: 'Standard term tuition fee' },
          { id: 2, name: 'Hostel Fee', amount: 200, description: 'Monthly boarding and lodging' },
          { id: 3, name: 'Transport Fee', amount: 50, description: 'Monthly bus service' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query))
    );
  });

  const columns: Column<FeeCategory>[] = [
    { key: 'id', header: 'ID', render: (c) => <span className="text-slate-500 text-xs font-mono">#{c.id}</span> },
    { key: 'name', header: 'Category Name', render: (c) => <span className="font-semibold">{c.name}</span> },
    { key: 'description', header: 'Description', render: (c) => c.description || <span className="text-slate-400">—</span> },
    { key: 'amount', header: 'Default Amount', render: (c) => <span className="font-medium text-[#16a34a]">${c.amount.toFixed(2)}</span> },
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
        <h1 className="text-2xl font-bold text-[#111827]">Fee Categories</h1>
        <p className="text-sm text-[#6b7280]">Define and manage different types of fees applicable to students</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        actionLabel="Create Category"
        onAction={() => alert('Create Category modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading categories..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          keyExtractor={(c) => c.id}
          emptyMessage="No fee categories found."
        />
      )}
    </div>
  );
}
