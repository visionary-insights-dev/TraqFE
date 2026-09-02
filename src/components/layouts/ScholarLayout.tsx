"use client";

import {
  Home,
  ListChecks,
  BookOpen,
  CalendarDays,
  LineChart,
  MoreHorizontal,
} from "lucide-react";
import { Sidebar } from "@/components/shared/Sidebar";
import { BottomNav } from "@/components/shared/BottomNav";
import type { NavItem } from "@/components/shared/Sidebar/types";
import type { BottomNavItem } from "@/components/shared/BottomNav/types";
import type { ScholarLayoutProps } from "./types";

const desktopNav: NavItem[] = [
  { label: "Home", href: "/scholar/dashboard", icon: Home },
  { label: "Assignments", href: "/scholar/assignments", icon: ListChecks },
  { label: "Resources", href: "/scholar/resources", icon: BookOpen },
  { label: "Meetings", href: "/scholar/meetings", icon: CalendarDays },
  { label: "Progress", href: "/scholar/progress", icon: LineChart },
];

const mobileNav: BottomNavItem[] = [
  { label: "Home", href: "/scholar/dashboard", icon: Home },
  { label: "Tasks", href: "/scholar/assignments", icon: ListChecks },
  { label: "Resources", href: "/scholar/resources", icon: BookOpen },
  { label: "Progress", href: "/scholar/progress", icon: LineChart },
  { label: "More", href: "/scholar/profile", icon: MoreHorizontal },
];

export const ScholarLayout = ({ children }: ScholarLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-50 lg:flex">
      <div className="hidden lg:block">
        <Sidebar
          items={desktopNav}
          brand={<Brand />}
          aria-label="Scholar navigation"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Avatar />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
      <div className="lg:hidden">
        <BottomNav items={mobileNav} />
      </div>
    </div>
  );
};

const Brand = () => (
  <span className="flex items-center gap-2 text-lg font-bold text-neutral-900">
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
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
