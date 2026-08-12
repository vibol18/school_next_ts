'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
// import { bookIssueApi } from '@/lib/api/library.api';

interface Transaction {
  id: number;
  bookTitle: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
}

export default function LibraryTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mocking realistic placeholder data as requested for unimplemented endpoints
    // TODO: Swap to real API call when backend is ready
    // async function loadTransactions() {
    //   const data = await bookIssueApi.getAll();
    //   setTransactions(data);
    // }
    
    setTimeout(() => {
      setTransactions([
        { id: 1, bookTitle: 'The Great Gatsby', studentName: 'Alice Johnson', issueDate: '2024-03-01', dueDate: '2024-03-15', returnDate: null, status: 'Issued' },
        { id: 2, bookTitle: 'To Kill a Mockingbird', studentName: 'Bob Smith', issueDate: '2024-02-20', dueDate: '2024-03-05', returnDate: '2024-03-04', status: 'Returned' },
        { id: 3, bookTitle: '1984', studentName: 'Charlie Davis', issueDate: '2024-02-15', dueDate: '2024-03-01', returnDate: null, status: 'Overdue' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const query = search.toLowerCase();
    return (
      t.bookTitle.toLowerCase().includes(query) ||
      t.studentName.toLowerCase().includes(query) ||
      t.status.toLowerCase().includes(query)
    );
  });

  const columns: Column<Transaction>[] = [
    { key: 'id', header: 'ID', render: (t) => <span className="text-slate-500 text-xs font-mono">#{t.id}</span> },
    { key: 'bookTitle', header: 'Book Title', render: (t) => <span className="font-semibold">{t.bookTitle}</span> },
    { key: 'studentName', header: 'Student' },
    { key: 'issueDate', header: 'Issued On' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'returnDate', header: 'Returned On', render: (t) => t.returnDate || <span className="text-slate-400">—</span> },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <Badge>{t.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (t) => (
        <div className="flex gap-2">
          {t.status !== 'Returned' && (
            <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
              Mark Returned
            </button>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Library Transactions</h1>
        <p className="text-sm text-[#6b7280]">Track book issues, returns, and overdue items</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by book title or student name..."
        actionLabel="Issue Book"
        onAction={() => alert('Issue Book modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading transactions..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredTransactions}
          keyExtractor={(t) => t.id}
          emptyMessage="No transactions found."
        />
      )}
    </div>
  );
}
