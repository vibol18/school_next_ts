"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
  User,
  Settings,
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

// Small, consistent icon-button used across the header
function HeaderIconButton({
  children,
  dotClassName,
  label,
}: {
  children: ReactNode;
  dotClassName?: string;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-colors"
    >
      {children}
      {dotClassName && (
        <span
          className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-2 ring-white ${dotClassName}`}
        />
      )}
    </button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [userRole, setUserRole] = useState<string>("STUDENT");
  const [userEmail, setUserEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState("2024 / 2025");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const storedRole = localStorage.getItem("userRole") || "STUDENT";
    const storedName = localStorage.getItem("username") || "Admin User";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedAvatar = localStorage.getItem("userAvatar");

    setUserRole(storedRole.toUpperCase());
    setUsername(storedName);
    setUserEmail(storedEmail);

    if (storedAvatar) {
      // Resolve relative path from Spring Boot backend if necessary
      if (storedAvatar.startsWith("http") || storedAvatar.startsWith("data:")) {
        setAvatarUrl(storedAvatar);
      } else {
        setAvatarUrl(`${API_BASE_URL}${storedAvatar.startsWith("/") ? "" : "/"}${storedAvatar}`);
      }
    }
  }, [router]);

  // Close the profile dropdown on outside click / Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const roleStyles: Record<string, string> = {
    ADMIN: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
    TEACHER: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
    STUDENT: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[248px] bg-[#12131f] text-[#9ca3af] flex flex-col shrink-0 overflow-y-auto select-none">
        <div className="pt-7 pb-6 px-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5b51ef] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-[16px] font-bold text-white tracking-wide">
              EduCore
            </h1>
            <span className="text-[10px] text-[#6b7280] font-medium">
              School Management
            </span>
          </div>
        </div>

        {/* Dynamic Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 mt-1">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-[#5b51ef] text-white shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                    : "text-[#8b93a3] hover:text-slate-100 hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    isActive ? "bg-white" : "bg-[#454a58] group-hover:bg-[#6b7280]"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/[0.08]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-[13px] font-medium text-[#8b93a3] hover:text-rose-400 transition-colors px-3.5 py-2.5 rounded-lg hover:bg-white/[0.06]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Navigation Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 gap-4">

          {/* Search Bar */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-10 py-2 text-[13px] rounded-lg border border-slate-200 bg-slate-50/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]/20 focus:border-[#5b51ef] transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] text-slate-400 bg-white font-mono select-none">
              ⌘K
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">

            {/* Academic Year Selector */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-[12px] text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{academicYear}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Language Flag Selector */}
            <HeaderIconButton label="Change language">
              <span className="text-sm">🌐</span>
            </HeaderIconButton>

            {/* Add / Quick Actions */}
            <HeaderIconButton label="Quick add">
              <PlusCircle className="w-4 h-4" />
            </HeaderIconButton>

            {/* Theme Toggle */}
            <HeaderIconButton label="Toggle theme">
              <Sun className="w-4 h-4" />
            </HeaderIconButton>

            {/* Notification Bell */}
            <HeaderIconButton label="Notifications" dotClassName="bg-rose-500">
              <Bell className="w-4 h-4" />
            </HeaderIconButton>

            {/* Messages */}
            <HeaderIconButton label="Messages" dotClassName="bg-sky-400">
              <MessageSquare className="w-4 h-4" />
            </HeaderIconButton>

            {/* Analytics */}
            <HeaderIconButton label="Analytics">
              <BarChart2 className="w-4 h-4" />
            </HeaderIconButton>

            {/* Fullscreen Toggle */}
            <HeaderIconButton label="Toggle fullscreen">
              <Maximize className="w-4 h-4" />
            </HeaderIconButton>

            {/* User Profile + Dropdown */}
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-lg border transition-colors ${
                  isProfileOpen
                    ? "border-[#5b51ef]/40 bg-[#5b51ef]/5"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-gradient-to-br from-[#6a60f5] to-[#4238d1]">
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
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[13px] font-semibold text-slate-800 max-w-[110px] truncate">
                    {username}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {userRole.charAt(0) + userRole.slice(1).toLowerCase()}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown panel: shows name + role */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-900/5 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Identity block */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-gradient-to-br from-[#6a60f5] to-[#4238d1]">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">
                        {username}
                      </p>
                      {userEmail ? (
                        <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                      ) : null}
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          roleStyles[userRole] ?? "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
                        }`}
                      >
                        {userRole}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link
                    href="/settings/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    View profile
                  </Link>
                  <Link
                    href="/settings/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Account settings
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
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