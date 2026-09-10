import {
  File,
  FileText,
  LayoutGrid,
  Link2,
  Search,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResourceFiltersProps, ResourceTypeFilter } from "./types";

export const TYPE_OPTIONS: {
  value: ResourceTypeFilter;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "ALL", label: "All", icon: LayoutGrid },
  { value: "PDF", label: "PDF", icon: FileText },
  { value: "LINK", label: "Links", icon: Link2 },
  { value: "FILE", label: "Files", icon: File },
  { value: "VIDEO", label: "Videos", icon: Video },
];

export const ResourceFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
}: ResourceFiltersProps) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden="true"
        />
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources..."
          className="h-12 w-full rounded-xl border border-white/60 bg-white/80 pl-10 pr-11 text-sm text-neutral-900 shadow-sm backdrop-blur placeholder:text-neutral-500 transition-all duration-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-400"
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div
        role="group"
        aria-label="Filter resources by type"
        className="glass-surface flex flex-wrap gap-1 rounded-2xl p-1.5"
      >
        {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = type === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTypeChange(value)}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.97]",
                isActive
                  ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/30"
                  : "text-neutral-600 hover:bg-white/70 hover:text-neutral-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};