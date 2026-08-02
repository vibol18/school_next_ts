'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export function Topbar() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-sm">
          AU
        </div>
        <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
          Admin User
        </span>
      </div>
    </header>
  );
}