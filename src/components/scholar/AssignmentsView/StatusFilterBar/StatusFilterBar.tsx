import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { AssignmentFilter } from "../types";
import type { StatusFilterBarProps } from "./types";

export const FILTER_OPTIONS: { value: AssignmentFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "AWAITING", label: "Awaiting" },
  { value: "COMPLETED", label: "Completed" },
  { value: "OVERDUE", label: "Overdue" },
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
      className="flex flex-wrap gap-2"
    >
      {FILTER_OPTIONS.map(({ value, label }, index) => {
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
              "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.97]",
              isActive
                ? "border-brand-700 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-md"
                : "border-transparent bg-white/70 text-neutral-600 hover:border-neutral-200 hover:bg-white hover:text-neutral-900"
            )}
          >
            {label}
            {count > 0 ? (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold transition-colors duration-300",
                  isActive ? "bg-white/25 text-white" : "bg-neutral-200 text-neutral-700"
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
