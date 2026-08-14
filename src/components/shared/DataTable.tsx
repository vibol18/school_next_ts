'use client';

import React from 'react';
import { Badge } from './Badge';
import { Pagination } from './Pagination';
import { usePagination } from '@/lib/hooks/usePagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pageSize?: number;
  showPagination?: boolean;
}

const STATUS_KEYS = ['status', 'statustext', 'state', 'leavestatus', 'paymentstatus'];

function isStatusColumn(key: string): boolean {
  return STATUS_KEYS.includes(key.toLowerCase().replace(/[^a-z]/g, ''));
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data found.',
  pageSize = 10,
  showPagination = true,
}: DataTableProps<T>) {
  const { page, setPage, pagedItems, totalItems } = usePagination(data, pageSize);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm">
        <div className="p-8 text-center text-sm text-[#6b7280]">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedItems.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => {
                  const value = col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode);
                  const isStatus = !col.render && isStatusColumn(col.key) && typeof value === 'string';
                  return (
                    <td key={col.key} className={`px-5 py-3.5 text-[#111827] ${col.className ?? ''}`}>
                      {isStatus ? <Badge>{value}</Badge> : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={setPage} />
      )}
    </div>
  );
}
