'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';
// import { paymentApi } from '@/lib/api/fee.api';

interface FeePayment {
  id: number;
  studentName: string;
  feeCategory: string;
  amount: number;
  dueDate: string;
  status: string;
}

export default function FeesPaymentsPage() {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Swap to real API call when backend is ready
    // async function loadPayments() {
    //   const data = await paymentApi.getAll(); // Assuming an endpoint exists
    //   setPayments(data);
    // }
    
    setTimeout(() => {
      setPayments([
        { id: 101, studentName: 'Alice Johnson', feeCategory: 'Tuition Fee - Term 1', amount: 500, dueDate: '2024-04-01', status: 'Paid' },
        { id: 102, studentName: 'Bob Smith', feeCategory: 'Hostel Fee', amount: 200, dueDate: '2024-04-15', status: 'Pending' },
        { id: 103, studentName: 'Charlie Davis', feeCategory: 'Transport Fee', amount: 50, dueDate: '2024-03-01', status: 'Overdue' },
        { id: 104, studentName: 'Diana Prince', feeCategory: 'Tuition Fee - Term 1', amount: 500, dueDate: '2024-04-01', status: 'Paid' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPayments = payments.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.studentName.toLowerCase().includes(query) ||
      p.feeCategory.toLowerCase().includes(query) ||
      p.status.toLowerCase().includes(query)
    );
  });

  const columns: Column<FeePayment>[] = [
    { key: 'id', header: 'Receipt No.', render: (p) => <span className="text-slate-500 text-xs font-mono">RCPT-{p.id}</span> },
    { key: 'studentName', header: 'Student', render: (p) => <span className="font-semibold">{p.studentName}</span> },
    { key: 'feeCategory', header: 'Category' },
    { key: 'amount', header: 'Amount', render: (p) => <span className="font-medium">${p.amount.toFixed(2)}</span> },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <Badge>{p.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex gap-2">
          {p.status === 'Paid' ? (
            <button className="text-xs text-[#16a34a] hover:text-[#15803d] font-medium bg-[#dbf5e3] px-2 py-1 rounded">
              Download Receipt
            </button>
          ) : (
            <button className="text-xs text-[#4f46e5] hover:text-[#4338ca] font-medium bg-[#e5e5fa] px-2 py-1 rounded">
              Record Payment
            </button>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Fees & Payments</h1>
        <p className="text-sm text-[#6b7280]">Manage student fee collection, pending dues, and receipts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Collected" value="$128,400" accentColor="#16a34a" icon={<DollarSign className="w-5 h-5 text-[#16a34a]" />} />
        <StatCard label="Pending Payments" value="$12,300" accentColor="#d97706" icon={<Clock className="w-5 h-5 text-[#d97706]" />} />
        <StatCard label="Overdue Fees" value="$4,500" accentColor="#dc2626" icon={<AlertCircle className="w-5 h-5 text-[#dc2626]" />} />
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name or fee category..."
        actionLabel="Collect Fee"
        onAction={() => alert('Collect Fee modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading payment records..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPayments}
          keyExtractor={(p) => p.id}
          emptyMessage="No fee records found."
        />
      )}
    </div>
  );
}