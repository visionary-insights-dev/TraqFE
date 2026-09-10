import { GraduationCap, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberRowProps } from "./types";

export const MemberRow = ({ member, className }: MemberRowProps) => {
  const isMentor = member.role === "MENTOR";
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li
      className={cn(
        "glass-card glass-edge group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt=""
          className={cn(
            "h-12 w-12 shrink-0 rounded-full object-cover ring-2 transition-all duration-300 group-hover:scale-105",
            isMentor
              ? "ring-amber-400/60 shadow-md shadow-amber-500/20"
              : "ring-brand-500/40 shadow-md shadow-brand-500/10"
          )}
        />
      ) : (
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 transition-transform duration-300 group-hover:scale-105",
            isMentor
              ? "ember-glow bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 ring-amber-300/50 shadow-md shadow-amber-500/30"
              : "bg-gradient-to-br from-brand-500 to-violet-600 text-white ring-brand-300/40 shadow-md shadow-brand-500/20"
          )}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900 dark:text-white">
          {member.name}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-600 dark:text-slate-400">
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-300",
              isMentor
                ? "bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300"
                : "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
            )}
          >
            {isMentor ? (
              <GraduationCap className="h-3 w-3" aria-hidden="true" />
            ) : (
              <UserRound className="h-3 w-3" aria-hidden="true" />
            )}
          </span>
          {isMentor ? "Mentor" : "Scholar"}
        </p>
      </div>
    </li>
  );
};