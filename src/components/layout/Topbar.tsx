'use client';

import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';
}

export function Topbar() {
  const { toggleSidebar } = useUIStore();
  const [displayName, setDisplayName] = useState('User');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';
    const username = localStorage.getItem('username') || '';
    setDisplayName(`${firstName} ${lastName}`.trim() || username || 'User');
    setPhoto(localStorage.getItem('userPhoto') || null);
  }, []);

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
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-sm overflow-hidden">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            getInitials(displayName)
          )}
        </div>
        <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
          {displayName}
        </span>
      </div>
    </header>
  );
}
