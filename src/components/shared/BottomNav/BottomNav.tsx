"use client";

import { cn } from "@/lib/utils";
import type { BottomNavProps } from "./types";

export const BottomNav = ({ items, className, ...props }: BottomNavProps) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "glass-surface glass-edge fixed inset-x-0 bottom-0 z-40 border-t border-white/40 pb-[env(safe-area-inset-bottom)] dark:border-white/8",
        className
      )}
      {...props}
    >
      <ul className="grid auto-cols-fr grid-flow-col">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                aria-label={item.ariaLabel ?? item.label}
                className={cn(
                  "relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.96]",
                  item.active
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-slate-400 dark:hover:text-slate-200"
                )}
              >
                {Icon ? (
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full transition-all duration-200",
                      item.active
                        ? "ember-glow h-7 w-12 bg-gradient-to-b from-amber-400/25 to-amber-500/10"
                        : "h-7 w-12 bg-transparent"
                    )}
                  >
                    <Icon
                      className="h-[22px] w-[22px]"
                      strokeWidth={item.active ? 2.2 : 1.8}
                      aria-hidden="true"
                    />
                  </span>
                ) : null}
                <span
                  className={cn(
                    "truncate text-[11px]",
                    item.active ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Safe-area breathing room + hairline light catcher */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10"
      />
    </nav>
  );
};