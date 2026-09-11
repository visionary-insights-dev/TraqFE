"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { getUser } from "@/stores/auth";
import { useLogout } from "@/hooks/auth";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  MENTOR: "Mentor",
  SCHOLAR: "Scholar",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/80 dark:ring-white/10"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 text-sm font-semibold text-white shadow-md shadow-brand-600/30 ring-2 ring-white/80 dark:ring-white/15"
    >
      {initials(name) || "?"}
    </span>
  );
}

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const user = getUser();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const name = user?.name ?? "Account";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? "Member") : "Account";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open account menu for ${name}`}
        className={cn(
          "group flex min-h-[44px] items-center gap-2 rounded-full border py-1 pl-1 pr-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.98]",
          open
            ? "ember-glow border-amber-400/40 bg-white/80 dark:bg-white/10"
            : "border-white/50 bg-white/40 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        )}
      >
        <span className="relative">
          <UserAvatar name={name} avatarUrl={user?.avatarUrl} />
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success shadow-sm dark:border-slate-900"
          />
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold leading-tight text-neutral-900 dark:text-white">
            {name}
          </span>
          <span className="block text-xs text-neutral-500 dark:text-slate-400">
            {roleLabel}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-neutral-400 transition-transform duration-200 sm:block dark:text-slate-400",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="User menu"
          className="glass-card glass-edge pane-enter absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl"
        >
          <div className="border-b border-white/40 bg-gradient-to-br from-white/40 to-transparent px-4 py-3.5 dark:border-white/5">
            <p className="flex items-center gap-2 truncate text-sm font-semibold text-neutral-900 dark:text-white">
              <ShieldCheck
                className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"
                aria-hidden="true"
              />
              {name}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout.mutate();
              }}
              disabled={logout.isPending}
              className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-150 hover:bg-danger-light/70 hover:text-danger-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-danger/15 dark:hover:text-red-300"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger-light text-danger-dark transition-all duration-150 group-hover:bg-danger group-hover:text-white dark:bg-danger/15 dark:text-red-300 dark:group-hover:bg-danger">
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              </span>
              <span className="flex-1">
                {logout.isPending ? "Signing out…" : "Log out"}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}