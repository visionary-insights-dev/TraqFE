"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
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
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-neutral-200"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-semibold text-brand-800 ring-1 ring-brand-200"
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
        className="flex min-h-[44px] items-center gap-2 rounded-full py-1 pl-1 pr-2 text-left transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <UserAvatar name={name} avatarUrl={user?.avatarUrl} />
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold leading-tight text-neutral-900">
            {name}
          </span>
          <span className="block text-xs text-neutral-500">{roleLabel}</span>
        </span>
        <ChevronDown
          className="hidden h-4 w-4 text-neutral-400 sm:block"
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
        >
          <div className="border-b border-neutral-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {name}
            </p>
            <p className="truncate text-xs text-neutral-500">{user?.email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout.mutate();
            }}
            disabled={logout.isPending}
            className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            {logout.isPending ? "Signing out…" : "Log out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}