'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import { paymentApi } from '@/lib/api/fee.api';
import type { Payment } from '@/types/api.types';

export default function PendingFeesPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPending() {
      try {
        const data = await paymentApi.getPending();
        setPayments(data);
      } catch (error) {
        console.error('Failed to load pending payments:', error);
        // Fallback mock data
        setPayments([
          { id: 1, studentId: 101, feeCategoryId: 2, amount: 200, paidAt: '', method: 'CASH', remarks: 'Pending hostel fee' },
          { id: 2, studentId: 105, feeCategoryId: 3, amount: 50, paidAt: '', method: 'ONLINE', remarks: 'Pending transport fee' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadPending();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.remarks.toLowerCase().includes(query) ||
      p.studentId.toString().includes(query)
    );
  });

  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Payment ID', render: (p) => <span className="text-slate-500 font-mono text-xs">#{p.id}</span> },
    { key: 'studentId', header: 'Student ID' },
    { key: 'feeCategoryId', header: 'Fee Category ID' },
    { key: 'amount', header: 'Amount Due', render: (p) => <span className="font-semibold text-[#dc2626]">${p.amount.toFixed(2)}</span> },
    { key: 'remarks', header: 'Remarks' },
    { key: 'status', header: 'Status', render: () => <Badge variant="amber">Pending</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
          Send Reminder
        </button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Pending Dues</h1>
        <p className="text-sm text-[#6b7280]">Review and follow up on outstanding student fee payments</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student ID or remarks..."
        actionLabel="Send Bulk Reminder"
        onAction={() => alert('Bulk Reminder placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading pending dues..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPayments}
          keyExtractor={(p) => p.id}
          emptyMessage="No pending fees found."
        />
      )}
    </div>
  );
}
