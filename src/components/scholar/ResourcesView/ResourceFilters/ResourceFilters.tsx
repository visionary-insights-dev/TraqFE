import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResourceFiltersProps, ResourceTypeFilter } from "./types";

export const TYPE_OPTIONS: { value: ResourceTypeFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PDF", label: "PDF" },
  { value: "LINK", label: "Links" },
  { value: "FILE", label: "Files" },
  { value: "VIDEO", label: "Videos" },
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
          className="h-12 w-full rounded-xl border border-white/60 bg-white/80 pl-10 pr-11 text-sm text-neutral-900 shadow-sm backdrop-blur placeholder:text-neutral-500 transition-all duration-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {search ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div
        role="group"
        aria-label="Filter resources by type"
        className="flex flex-wrap gap-2"
      >
        {TYPE_OPTIONS.map(({ value, label }) => {
          const isActive = type === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTypeChange(value)}
              className={cn(
                "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97]",
                isActive
                  ? "border-brand-700 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-md focus-visible:ring-white"
                  : "border-white/60 bg-white/70 text-neutral-600 shadow-sm backdrop-blur hover:border-neutral-200 hover:bg-white hover:text-neutral-900 focus-visible:ring-brand-500"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
