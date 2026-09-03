"use client";

import { Users, ListChecks, Inbox, CalendarCheck, BookOpen, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/shared/Sidebar/types";
import type { MentorLayoutProps } from "./types";

const NAV: Array<Pick<NavItem, "label" | "href" | "icon">> = [
  { label: "My Scholars", href: "/mentor/scholars", icon: Users },
  { label: "Assignments", href: "/mentor/assignments", icon: ListChecks },
  { label: "Verification", href: "/mentor/verification", icon: Inbox },
  { label: "Attendance", href: "/mentor/attendance", icon: CalendarCheck },
  { label: "Resources", href: "/mentor/resources", icon: BookOpen },
  { label: "Settings", href: "/mentor/profile", icon: Settings },
];

export const MentorLayout = ({ children }: MentorLayoutProps) => {
  const pathname = usePathname() ?? "";

  const nav: NavItem[] = NAV.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));

  return (
    <div className="mx-auto flex min-h-screen max-w-[1280px] bg-neutral-50">
      <Sidebar items={nav} brand={<Brand />} aria-label="Mentor navigation" />
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
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary-500 text-sm font-bold text-white">
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
