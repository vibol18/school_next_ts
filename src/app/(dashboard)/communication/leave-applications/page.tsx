'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { ListToolbar } from '@/components/shared/ListToolbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/shared/Badge';

interface LeaveApplication {
  id: number;
  applicantName: string;
  role: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export default function LeaveApplicationsPage() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setApplications([
        { id: 1, applicantName: 'John Smith', role: 'Teacher', startDate: '2024-03-10', endDate: '2024-03-12', reason: 'Medical Checkup', status: 'Pending' },
        { id: 2, applicantName: 'Alice Johnson', role: 'Student', startDate: '2024-03-15', endDate: '2024-03-15', reason: 'Family Function', status: 'Approved' },
        { id: 3, applicantName: 'Bob Williams', role: 'Staff', startDate: '2024-02-20', endDate: '2024-02-25', reason: 'Vacation', status: 'Rejected' },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredApplications = applications.filter((a) => {
    const query = search.toLowerCase();
    return (
      a.applicantName.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query) ||
      a.reason.toLowerCase().includes(query)
    );
  });

  const columns: Column<LeaveApplication>[] = [
    { 
      key: 'applicant', 
      header: 'Applicant', 
      render: (a) => (
        <div>
          <div className="font-semibold text-[#111827]">{a.applicantName}</div>
          <div className="text-xs text-[#6b7280]">{a.role}</div>
        </div>
      ) 
    },
    { key: 'dates', header: 'Duration', render: (a) => `${a.startDate} to ${a.endDate}` },
    { key: 'reason', header: 'Reason', render: (a) => <span className="truncate max-w-[200px] block" title={a.reason}>{a.reason}</span> },
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
          {a.status === 'Pending' ? (
            <>
              <button className="text-xs text-[#16a34a] hover:text-[#15803d] font-medium bg-[#dbf5e3] px-2 py-1 rounded">Approve</button>
              <button className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium bg-[#fde2e2] px-2 py-1 rounded">Reject</button>
            </>
          ) : (
            <span className="text-xs text-slate-400">Processed</span>
          )}
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Leave Applications</h1>
        <p className="text-sm text-[#6b7280]">Review and approve leave requests from staff and students</p>
      </div>

      <ListToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by applicant name or role..."
        actionLabel="Apply for Leave"
        onAction={() => alert('Apply for Leave modal placeholder')}
      />

      {loading ? (
        <LoadingSpinner text="Loading leave applications..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredApplications}
          keyExtractor={(a) => a.id}
          emptyMessage="No leave applications found."
        />
      )}
    </div>
  );
}
