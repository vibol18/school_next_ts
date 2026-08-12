'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface Notice {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  isActive: boolean;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setNotices([
        { id: 1, title: 'Term 1 Exam Schedule Released', author: 'Admin User', publishedAt: '2024-03-01', isActive: true },
        { id: 2, title: 'Annual Sports Day Postponed', author: 'Principal', publishedAt: '2024-03-05', isActive: true },
        { id: 3, title: 'Winter Vacation Announcement', author: 'Admin User', publishedAt: '2023-12-10', isActive: false },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredNotices = notices.filter((n) => {
    const query = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(query) ||
      n.author.toLowerCase().includes(query)
    );
  });

  const columns: Column<Notice>[] = [
    { key: 'title', header: 'Notice Title', render: (n) => <span className="font-semibold text-[#111827]">{n.title}</span> },
    { key: 'author', header: 'Published By' },
    { key: 'publishedAt', header: 'Date Published' },
    {
      key: 'status',
      header: 'Status',
      render: (n) => <Badge variant={n.isActive ? 'green' : 'slate'}>{n.isActive ? 'Active' : 'Archived'}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          View Notice
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Notices</h1>
        <p className="text-sm text-[#6b7280]">Manage school-wide announcements and notice board</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notices by title or author..."
        actionLabel="Create Notice"
        onAction={() => alert('Create Notice modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading notices..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredNotices}
          keyExtractor={(n) => n.id}
          emptyMessage="No notices found."
        />
      )}
    </div>
  );
}
