"use client";

import {
  BarChart3,
  FilePlus2,
  FolderPlus,
  GraduationCap,
  ListChecks,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Invite scholar",
    description: "Send an invite link",
    href: "/admin/invitations",
    icon: UserPlus,
  },
  {
    label: "New program",
    description: "Set up a program",
    href: "/admin/programs/new",
    icon: FolderPlus,
  },
  {
    label: "New course",
    description: "Add a course",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    label: "Create assignment",
    description: "For any mentor",
    href: "/admin/assignments/new",
    icon: FilePlus2,
  },
  {
    label: "Verify queue",
    description: "Review submissions",
    href: "/admin/assignments/verification",
    icon: ListChecks,
  },
  {
    label: "Generate report",
    description: "Export analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
];

export const QuickActions = () => {
  return (
    <section className="glass-card overflow-hidden rounded-2xl" aria-labelledby="quick-actions-heading">
      <header className="border-b border-neutral-200/70 px-5 py-4">
        <h2 id="quick-actions-heading" className="text-sm font-semibold text-neutral-900">
          Quick actions
        </h2>
      </header>
      <div className="grid grid-cols-2 gap-px bg-neutral-200/60 sm:grid-cols-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col gap-2 bg-white/70 px-4 py-4 transition-colors hover:bg-brand-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {action.label}
              </span>
              <span className="text-xs text-neutral-500">{action.description}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};