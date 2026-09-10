"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import type { DataTableColumn, DataTableProps } from "./types";

type SortState = { key: string; dir: "asc" | "desc" } | null;

/**
 * Dense admin data table with optional client-side sorting (numeric-aware),
 * explicit actions via cell renders, and a skeleton loading state. Semantic
 * `table` markup with a visually-hidden caption for screen readers.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  getRowClassName,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  isLoading = false,
  skeletonRowCount = 6,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, sort, columns]);

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortValue) return;
    setSort((prev) => {
      if (prev?.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  };

  const SortIcon = ({ col }: { col: DataTableColumn<T> }) => {
    if (!col.sortValue) return null;
    if (sort?.key === col.key) {
      return sort.dir === "asc" ? (
        <ArrowUp className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <ArrowDown className="ml-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      );
    }
    return (
      <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
    );
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">{caption ?? "Data table"}</caption>
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/70">
              {columns.map((col) => {
                const sortable = Boolean(col.sortValue);
                const ariaSort =
                  sort?.key === col.key
                    ? sort.dir === "asc"
                      ? ("ascending" as const)
                      : ("descending" as const)
                    : undefined;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      "h-11 whitespace-nowrap px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500",
                      sortable && "cursor-pointer select-none hover:text-neutral-700",
                      col.headerClassName
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className="inline-flex items-center gap-0 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                        aria-label={`Sort by ${col.header}`}
                      >
                        {col.header}
                        <SortIcon col={col} />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: skeletonRowCount }).map((_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`} className="border-b border-neutral-100">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="skeleton-shimmer h-3.5 w-24 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : sorted.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={cn(
                      "border-b border-neutral-100 transition-colors last:border-0 hover:bg-brand-50/40",
                      getRowClassName?.(row)
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3 text-sm text-neutral-700", col.className)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && sorted.length === 0 ? (
        <div className="p-2">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      ) : null}
    </div>
  );
}