"use client";

import { cn } from "@/lib/utils";
import type { BottomNavProps } from "./types";

export const BottomNav = ({ items, className, ...props }: BottomNavProps) => {
  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)]",
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
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                  item.active
                    ? "text-brand-700"
                    : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                {Icon ? (
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={item.active ? 2.2 : 1.8}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
