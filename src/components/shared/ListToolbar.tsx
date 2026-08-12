'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  children?: React.ReactNode;
}

export function ListToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  actionLabel,
  onAction,
  actionHref,
  children,
}: ListToolbarProps) {
  const ActionTag = actionHref ? 'a' : 'button';
  return (
    <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-[8px] border border-[#e5e7eb] bg-[#f8fafc] text-[#111827] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-colors"
        />
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && (
          <ActionTag
            {...(actionHref ? { href: actionHref } : { onClick: onAction })}
            className="inline-flex items-center gap-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </ActionTag>
        )}
      </div>
    </div>
  );
}
