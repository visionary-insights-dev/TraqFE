"use client";

import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Users,
  Shuffle,
  ListChecks,
  CalendarCheck,
  FileText,
  ScrollText,
  Settings,
} from "lucide-react";
import { Sidebar } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/shared/Sidebar/types";
import type { AdminLayoutProps } from "./types";

const nav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Programs", href: "/admin/programs", icon: FolderKanban },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "People", href: "/admin/people", icon: Users },
  { label: "Sort or Pair", href: "/admin/pairing", icon: Shuffle },
  { label: "Assignments", href: "/admin/assignments", icon: ListChecks },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Audit Log", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] bg-neutral-50">
      <Sidebar items={nav} brand={<Brand />} aria-label="Admin navigation" />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-neutral-200 bg-white px-6">
          <Avatar />
        </header>
        <main className={cn("flex-1 px-6 py-6")}>{children}</main>
      </div>
    </div>
  );
};

const Brand = () => (
  <span className="flex items-center gap-2 text-lg font-bold text-neutral-900">
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-sm font-bold text-white">
      T
    </span>
    Traq
  </span>
);

const Avatar = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
    ?
  </div>
);
