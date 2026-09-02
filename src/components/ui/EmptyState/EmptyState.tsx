import { cn } from "@/lib/utils";
import type { EmptyStateProps } from "./types";

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  hasFilters = false,
  onClearFilters,
  className,
  ...props
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-neutral-500">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-neutral-800">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      {hasFilters && onClearFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          Clear filters
        </button>
      ) : (
        action
      )}
    </div>
  );
};
