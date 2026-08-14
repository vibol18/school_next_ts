'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { messageApi } from '@/lib/api/communication.api';

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Students', href: '/students' },
  { name: 'Teachers', href: '/teachers' },
  { name: 'Classes & Subjects', href: '/academic/classes' },
  { name: 'Attendance', href: '/attendance' },
  { name: 'Timetable', href: '/timetable' },
  { name: 'Exams & Results', href: '/exams' },
  { name: 'Assignments', href: '/assignments' },
  { name: 'Fees & Payments', href: '/fees/payments' },
  { name: 'Library', href: '/library/books' },
  { name: 'Hostel & Transport', href: '/hostel/blocks' },
  { name: 'Communication', href: '/communication/notices' },
  { name: 'Messages', href: '/communication/messages/inbox' },
  { name: 'Settings', href: '/settings/profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedId = localStorage.getItem('userId');
    if (!storedId) return;
    const userId = parseInt(storedId, 10);
    let active = true;
    const load = () => {
      messageApi
        .getUnreadCount(userId)
        .then((n) => active && setUnread(n))
        .catch(() => active && setUnread(0));
    };
    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <aside className="w-[240px] bg-black text-[#9ca3af] flex flex-col h-screen shrink-0 overflow-y-auto select-none">
      {/* Brand Title */}
      <div className="pt-8 pb-6 px-7">
        <h1 className="text-[21px] font-bold text-white tracking-wide">
          EduCore
        </h1>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          // Check if link is currently active
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#5b51ef] text-white shadow-sm'
                  : 'text-[#858d9d] hover:text-slate-200 hover:bg-[#1a1d2e]'
              }`}
            >
              {/* Small Bullet Dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isActive ? 'bg-white' : 'bg-[#4b5563]'
                }`}
              />
              <span className="truncate">{item.name}</span>
              {item.name === 'Messages' && unread > 0 && (
                <span className="ml-auto shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#5b51ef] text-white text-[11px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}