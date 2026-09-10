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
import { UserMenu } from "@/components/shared/UserMenu";
import { WebSocketProvider } from "@/components/shared/Providers";
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
    <WebSocketProvider>
      <div className="scholar-shell min-h-screen lg:flex">
        <div className="hidden lg:block">
          <Sidebar
            items={desktopNav}
            brand={<Brand />}
            aria-label="Scholar navigation"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <header className="glass-surface sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/40 px-4 shadow-sm dark:border-white/5 lg:px-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/10" />
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <UserMenu />
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
    </WebSocketProvider>
  );
};

const Brand = () => (
  <span className="flex items-center gap-2.5 text-lg font-bold text-neutral-900 dark:text-white">
    <span className="ember-glow flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-brand-600 text-sm font-bold text-white shadow-md shadow-amber-500/30">
      T
    </span>
    Traq
  </span>
);