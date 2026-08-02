"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import {
  Search,
  Calendar,
  PlusCircle,
  Sun,
  Bell,
  MessageSquare,
  BarChart2,
  Maximize,
  User,
  LogOut,
} from "lucide-react";

// Spring Boot Backend Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface NavItem {
  name: string;
  href: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { name: "Students", href: "/students", roles: ["ADMIN", "TEACHER"] },
  { name: "Teachers", href: "/teachers", roles: ["ADMIN"] },
  { name: "Classes & Subjects", href: "/academic/classes", roles: ["ADMIN"] },
  { name: "Attendance", href: "/attendance", roles: ["ADMIN", "TEACHER"] },
  { name: "Timetable", href: "/timetable", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { name: "Exams & Results", href: "/exams", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { name: "Assignments", href: "/assignments", roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { name: "Fees & Payments", href: "/fees/payments", roles: ["ADMIN", "STUDENT"] },
  { name: "Library", href: "/library/books", roles: ["ADMIN"] },
  { name: "Hostel & Transport", href: "/hostel/blocks", roles: ["ADMIN"] },
  { name: "Communication", href: "/communication/notices", roles: ["ADMIN"] },
  { name: "Settings", href: "/settings/profile", roles: ["ADMIN", "TEACHER", "STUDENT"] },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [userRole, setUserRole] = useState<string>("STUDENT");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState("2024 / 2025");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const storedRole = localStorage.getItem("userRole") || "STUDENT";
    const storedName = localStorage.getItem("username") || "Admin User";
    const storedAvatar = localStorage.getItem("userAvatar");

    setUserRole(storedRole.toUpperCase());
    setUsername(storedName);

    if (storedAvatar) {
      // Resolve relative path from Spring Boot backend if necessary
      if (storedAvatar.startsWith("http") || storedAvatar.startsWith("data:")) {
        setAvatarUrl(storedAvatar);
      } else {
        setAvatarUrl(`${API_BASE_URL}${storedAvatar.startsWith("/") ? "" : "/"}${storedAvatar}`);
      }
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      document.cookie = "accessToken=; path=/; max-age=0;";
      document.cookie = "userRole=; path=/; max-age=0;";
      router.replace("/login");
    }
  };

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#131521] text-[#9ca3af] flex flex-col shrink-0 overflow-y-auto select-none">
        <div className="pt-7 pb-5 px-7">
          <h1 className="text-[21px] font-bold text-white tracking-wide">
            EduCore
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#5b51ef] text-white font-semibold uppercase mt-1 inline-block tracking-wider">
            {userRole}
          </span>
        </div>

        {/* Dynamic Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#5b51ef] text-white shadow-sm"
                    : "text-[#858d9d] hover:text-slate-200 hover:bg-[#1a1d2e]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? "bg-white" : "bg-[#4b5563]"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-xs font-medium text-[#858d9d] hover:text-rose-400 transition-colors px-4 py-2.5 rounded-lg hover:bg-[#1a1d2e]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navigation Header matching your image */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 gap-4">
          
          {/* Search Bar */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-3 pr-10 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5b51ef] focus:border-[#5b51ef]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 bg-slate-50 font-mono select-none">
              ⌘
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Academic Year Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 font-semibold cursor-pointer hover:bg-slate-50">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Year : {academicYear}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </div>

            {/* Language Flag Selector */}
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
              <span className="text-sm">🇺🇸</span>
            </button>

            {/* Add / Quick Actions */}
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <PlusCircle className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <Sun className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <button className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full ring-2 ring-white" />
            </button>

            {/* Analytics Icon */}
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
              <Maximize className="w-4 h-4" />
            </button>

            {/* User Profile Avatar */}
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-blue-500 ml-1">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl(null)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}