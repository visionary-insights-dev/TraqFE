import { useRef, type KeyboardEvent } from "react";
import {
  CheckCircle2,
  CircleDot,
  Clock,
  LayoutGrid,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssignmentFilter } from "../types";
import type { StatusFilterBarProps } from "./types";

export const FILTER_OPTIONS: {
  value: AssignmentFilter;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "ALL", label: "All", icon: LayoutGrid },
  { value: "PENDING", label: "Pending", icon: CircleDot },
  { value: "AWAITING", label: "Awaiting", icon: Clock },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { value: "OVERDUE", label: "Overdue", icon: TriangleAlert },
];

export const StatusFilterBar = ({
  active,
  counts,
  onChange,
}: StatusFilterBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % FILTER_OPTIONS.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + FILTER_OPTIONS.length) % FILTER_OPTIONS.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = FILTER_OPTIONS.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const next = FILTER_OPTIONS[nextIndex];
    onChange(next.value);
    const buttons =
      containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Filter assignments by status"
      className="glass-surface flex flex-wrap gap-1 rounded-2xl p-1.5"
    >
      {FILTER_OPTIONS.map(({ value, label, icon: Icon }, index) => {
        const isActive = active === value;
        const count = counts[value] ?? 0;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            aria-label={`${label}${count > 0 ? ` (${count})` : ""}`}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.97]",
              isActive
                ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/30"
                : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
            {count > 0 ? (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums transition-colors duration-200",
                  isActive
                    ? "bg-white/25 text-amber-950"
                    : "bg-white/70 text-neutral-700 dark:bg-white/10 dark:text-slate-300"
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};