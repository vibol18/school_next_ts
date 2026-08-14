'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  const pages: (number | 'ellipsis')[] = [0];
  const start = Math.max(1, current - 1);
  const end = Math.min(totalPages - 2, current + 1);
  if (start > 1) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 2) pages.push('ellipsis');
  pages.push(totalPages - 1);
  return pages;
}

export function Pagination({ page, pageSize, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize) return null;

  const start = page * pageSize + 1;
  const end = Math.min(totalItems, (page + 1) * pageSize);

  const btnBase =
    'inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
      <p className="text-[12px] text-slate-500">
        Showing{' '}
        <span className="font-semibold text-slate-700">
          {start}–{end}
        </span>{' '}
        of <span className="font-semibold text-slate-700">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
          className={`${btnBase} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers(page, totalPages).map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-[12px] text-slate-400 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`${btnBase} border ${
                p === page
                  ? 'border-[#5b51ef] bg-[#5b51ef] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {p + 1}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className={`${btnBase} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
