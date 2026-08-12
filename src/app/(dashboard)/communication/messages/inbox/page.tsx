'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface Message {
  id: number;
  senderName: string;
  subject: string;
  sentAt: string;
  isRead: boolean;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        { id: 1, senderName: 'Mr. John Smith', subject: 'Regarding Assignment 3', sentAt: '2024-03-01 09:30 AM', isRead: false },
        { id: 2, senderName: 'System Admin', subject: 'Scheduled Maintenance', sentAt: '2024-02-28 05:00 PM', isRead: true },
        { id: 3, senderName: 'Mrs. Jane Doe', subject: 'Parent-Teacher Meeting Notes', sentAt: '2024-02-25 11:15 AM', isRead: true },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredMessages = messages.filter((m) => {
    const query = search.toLowerCase();
    return (
      m.senderName.toLowerCase().includes(query) ||
      m.subject.toLowerCase().includes(query)
    );
  });

  const columns: Column<Message>[] = [
    { 
      key: 'senderName', 
      header: 'From', 
      render: (m) => (
        <span className={`text-[#111827] ${!m.isRead ? 'font-bold' : 'font-medium'}`}>
          {m.senderName}
        </span>
      ) 
    },
    { 
      key: 'subject', 
      header: 'Subject',
      render: (m) => (
        <span className={`text-[#111827] ${!m.isRead ? 'font-bold' : 'font-normal'}`}>
          {m.subject}
        </span>
      )
    },
    { key: 'sentAt', header: 'Received On' },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <Badge variant={m.isRead ? 'slate' : 'indigo'}>{m.isRead ? 'Read' : 'New'}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Read
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Messages Inbox</h1>
        <p className="text-sm text-[#6b7280]">View and respond to internal communications</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search messages by sender or subject..."
        actionLabel="Compose Message"
        onAction={() => alert('Compose Message modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading messages..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredMessages}
          keyExtractor={(m) => m.id}
          emptyMessage="No messages found in your inbox."
        />
      )}
    </div>
  );
}
