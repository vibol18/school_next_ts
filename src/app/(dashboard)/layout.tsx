"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { academicYearApi } from "@/lib/api/academic.api";
import { notificationApi } from "@/lib/api/notification.api";
import { ChatWidget } from "@/components/layout/ChatWidget";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  UserRound,
  GraduationCap,
  School,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Library,
  Bus,
  BedDouble,
  Megaphone,
  MessageSquare,
  Shapes,
  Map as MapIcon,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { error, log } from "console";

// Spring Boot Backend Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const ALL = ["ADMIN", "TEACHER", "STUDENT", "PARENT", "STAFF"];

const navGroups: NavGroup[] = [
  {
    label: "Main Menu",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL },
      { name: "Admin", href: "/settings/users", icon: ShieldCheck, roles: ["ADMIN"] },
      { name: "Students", href: "/students", icon: Users, roles: ["ADMIN", "TEACHER"] },
      { name: "Parents", href: "/parents", icon: UserRound, roles: ["ADMIN", "TEACHER"] },
      { name: "Teachers", href: "/teachers", icon: GraduationCap, roles: ["ADMIN"] },
    ],
  },
  {
    label: "Academics",
    items: [
      { name: "Class", href: "/academic/classes", icon: School, roles: ["ADMIN"] },
      { name: "Subject", href: "/academic/subjects", icon: BookOpen, roles: ["ADMIN"] },
      { name: "Class Routine", href: "/timetable", icon: CalendarClock, roles: ["ADMIN", "TEACHER", "STUDENT"] },
      { name: "Attendance", href: "/attendance", icon: ClipboardCheck, roles: ["ADMIN", "TEACHER"] },
      { name: "Exam", href: "/exams", icon: FileText, roles: ["ADMIN", "TEACHER", "STUDENT"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Library", href: "/library/books", icon: Library, roles: ["ADMIN"] },
      { name: "Transport", href: "/transport/routes", icon: Bus, roles: ["ADMIN"] },
      { name: "Hostel", href: "/hostel/blocks", icon: BedDouble, roles: ["ADMIN"] },
      { name: "Notice", href: "/communication/notices", icon: Megaphone, roles: ["ADMIN"] },
      { name: "Message", href: "/communication/messages/inbox", icon: MessageSquare, roles: ALL },
    ],
  },
  {
    label: "System",
    items: [
      { name: "UI Elements", href: "/permissions", icon: Shapes, roles: ALL },
      { name: "Map", href: "/files", icon: MapIcon, roles: ALL },
      { name: "Account", href: "/settings/profile", icon: Settings, roles: ALL },
    ],
  },
];

function HeaderIconButton({
  children,
  badge,
  label,
}: {
  children: ReactNode;
  badge?: number;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="relative w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-colors"
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("User");
  const [userRole, setUserRole] = useState<string>("STUDENT");
  const [userEmail, setUserEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [academicYear, setAcademicYear] = useState("2024 / 2025");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [academicYears, setAcademicYears] = useState<
    { id: number; yearName: string; current: boolean }[]
  >([]);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const storedRole = localStorage.getItem("userRole") || "STUDENT";
    const storedName = localStorage.getItem("username") || "Admin User";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedAvatar = localStorage.getItem("userAvatar") || localStorage.getItem("userPhoto");

    setUserRole(storedRole.toUpperCase());
    setUsername(storedName);
    setUserEmail(storedEmail);

    if (storedAvatar) {
      if (storedAvatar.startsWith("http") || storedAvatar.startsWith("data:")) {
        setAvatarUrl(storedAvatar);
      } else {
        setAvatarUrl(`${API_BASE_URL}${storedAvatar.startsWith("/") ? "" : "/"}${storedAvatar}`);
      }
    }

    const storedUserId = localStorage.getItem("userId");
    const id = storedUserId ? parseInt(storedUserId, 10) : null;
    if (id && storedRole) {
      notificationApi
        .getByRecipient(id, storedRole.toUpperCase())
        .then((list) => {
          const arr = Array.isArray(list) ? list : [];
          setUnreadCount(arr.filter((n) => !n.isRead).length);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [router]);

  useEffect(() => {
    let active = true;
    academicYearApi
      .getAll()
      .then((years) => {
        if (!active) return;
        setAcademicYears(years);
        const current = years.find((y: any) => y.current) || years[0];
        if (current) setAcademicYear(current.yearName);
      })
      .catch((error) => {
       console.log(error);
       
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsYearOpen(false);
      }
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

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`bg-[#0f172a] text-slate-400 flex flex-col shrink-0 transition-all duration-200 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        {/* Brand */}
        <div
          className={`h-16 flex items-center gap-3 border-b border-white/[0.06] px-4 shrink-0 ${
            collapsed ? "justify-center px-0" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-accent-500/30">
                <span className="text-white font-black text-base">A</span>
              </span>
              <span className="text-[19px] font-extrabold tracking-wide text-white">
                AKKHUR
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-500 shadow-lg shadow-accent-500/30">
              <span className="text-white font-black text-base">A</span>
            </Link>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="text-slate-500 hover:text-accent-400 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1e293b] border border-white/10 text-slate-300 hover:text-accent-400 flex items-center justify-center z-10"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
          {navGroups.map((group) => {
            const visible = group.items.filter((item) => item.roles.includes(userRole));
            if (visible.length === 0) return null;
            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visible.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={collapsed ? item.name : undefined}
                        className={`relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                          collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                        } ${
                          active
                            ? "bg-accent-500/15 text-accent-400"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-accent-500" />
                        )}
                        <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-accent-400" : ""}`} />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            title={collapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 text-[13px] font-medium text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/[0.06] ${
              collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between gap-4 shrink-0">
          {/* Title + Breadcrumb */}
          <div className="min-w-0">
            <h1 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
              Admin Dashboard
            </h1>
            <nav className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <Link href="/dashboard" className="hover:text-accent-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent-600 font-medium capitalize">
                {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
              </span>
            </nav>
          </div>

          {/* Global Search */}
          <div className="relative w-64 lg:w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, teachers…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/students?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="w-full pl-9 pr-4 py-2 text-[13px] rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/25 focus:border-accent-500 transition-colors"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Academic Year Selector */}
            <div className="relative hidden lg:block" ref={yearRef}>
              <button
                onClick={() => setIsYearOpen((open) => !open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-[12px] text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                <span className="max-w-[130px] truncate">{academicYear}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${isYearOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isYearOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-slide-in-up">
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Academic Years
                  </p>
                  {academicYears.length === 0 ? (
                    <p className="px-4 py-2 text-xs text-slate-400">No academic years found.</p>
                  ) : (
                    academicYears.map((year) => (
                      <button
                        key={year.id}
                        onClick={() => {
                          setAcademicYear(year.yearName);
                          setIsYearOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <span>{year.yearName}</span>
                        {year.current && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            Current
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <Link href="/notifications">
              <HeaderIconButton label="Notifications" badge={unreadCount}>
                <Bell className="w-[18px] h-[18px]" />
              </HeaderIconButton>
            </Link>

            {/* User Profile Badge + Dropdown */}
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl border transition-colors ${
                  isProfileOpen
                    ? "border-accent-500/40 bg-accent-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent-500/30 shrink-0 bg-gradient-to-br from-accent-400 to-accent-600">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    {userRole}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 animate-slide-in-up">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-gradient-to-br from-accent-400 to-accent-600">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">{username}</p>
                      {userEmail ? (
                        <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                      ) : null}
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide bg-accent-100 text-accent-700">
                        {userRole}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 my-1" />
                  <Link
                    href="/settings/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
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
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Floating chat widget */}
      <ChatWidget />
    </div>
  );
}
