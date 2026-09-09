"use client";

import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Mail,
  ScrollText,
  Settings,
  Shuffle,
  UserCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/shared/Sidebar/types";
import type { AdminLayoutProps } from "./types";

const NAV: Array<Pick<NavItem, "label" | "href" | "icon">> = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Programs", href: "/admin/programs", icon: FolderKanban },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Scholars", href: "/admin/scholars", icon: GraduationCap },
  { label: "Mentors", href: "/admin/mentors", icon: UserCheck },
  { label: "Sort & Pair", href: "/admin/pair", icon: Shuffle },
  { label: "Assignments", href: "/admin/assignments", icon: ListChecks },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Meetings", href: "/admin/meetings", icon: CalendarDays },
  { label: "Invitations", href: "/admin/invitations", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname() ?? "";

  const nav: NavItem[] = NAV.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));

  return (
    <div className="admin-shell mx-auto flex min-h-screen max-w-[1600px]">
      <Sidebar items={nav} brand={<Brand />} aria-label="Admin navigation" />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-white/60 bg-white/70 px-6 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
            <span className="font-medium">Workspace overview</span>
          </div>
          <HeaderActions />
        </header>
        <main className={cn("flex-1 px-6 py-6 lg:px-8")}>{children}</main>
      </div>
    </div>
  );
};

const Brand = () => (
  <span className="flex items-center gap-2 text-lg font-bold text-neutral-900">
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-sm font-bold text-white shadow-sm">
      T
    </span>
    Traq
    <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
      Admin
    </span>
  </span>
);

const HeaderActions = () => (
  <div className="flex items-center gap-2">
    <div className="hidden text-right sm:block">
      <p className="text-sm font-semibold leading-tight text-neutral-900">Admin</p>
      <p className="text-xs text-neutral-500">Super Admin</p>
    </div>
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-secondary-500 text-sm font-semibold text-white shadow-sm"
      aria-hidden="true"
    >
      A
    </div>
  </div>
);