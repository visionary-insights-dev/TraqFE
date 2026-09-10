import { CalendarClock, ChevronRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import {
  AssignmentStatusBadge,
  TaskStatusControl,
  canToggleTaskStatus,
} from "@/components/scholar/shared";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AssignmentCardProps } from "./types";

export const AssignmentCard = ({
  assignment,
  detailAction,
  onOpen,
}: AssignmentCardProps) => {
  const isOverdue = assignment.status === "OVERDUE";

  const body = (
    <div
      className={cn(
        "flex flex-1 items-start gap-4 text-left",
        onOpen && "group"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
          isOverdue
            ? "bg-gradient-to-br from-danger-light to-danger/15 text-danger-dark shadow-md shadow-danger/10 dark:from-danger/20 dark:to-danger/5 dark:text-red-300"
            : "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800 shadow-md shadow-brand-500/10 dark:from-brand-500/20 dark:to-brand-400/10 dark:text-brand-300"
        )}
      >
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            {assignment.title}
          </p>
          <AssignmentStatusBadge status={assignment.status} />
        </div>

        {assignment.description ? (
          <p
            className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-slate-400"
            title={assignment.description}
          >
            {assignment.description}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarClock
              className={cn(
                "h-4 w-4 shrink-0",
                isOverdue
                  ? "text-danger dark:text-red-400"
                  : "text-brand-600 dark:text-brand-300"
              )}
              aria-hidden="true"
            />
            {isOverdue ? "Was due" : "Due"}{" "}
            {formatDateTime(assignment.dueAt)}
          </span>
          {assignment.courseName ? (
            <span className="glass-chip rounded-md px-2 py-0.5 text-xs">
              {assignment.courseName}
            </span>
          ) : null}
        </div>
      </div>

      {onOpen ? (
        <ChevronRight
          className="h-5 w-5 shrink-0 text-neutral-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-300"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  return (
    <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Status accent rail */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          isOverdue
            ? "bg-gradient-to-b from-danger to-danger-dark"
            : "bg-gradient-to-b from-brand-500 via-violet-500 to-amber-400"
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardContent className="flex flex-col gap-4 py-5 pl-6 sm:flex-row sm:items-center sm:justify-between">
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className="flex flex-1 items-start rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.99]"
            aria-label={`View ${assignment.title}`}
          >
            {body}
          </button>
        ) : (
          body
        )}

        {detailAction ? (
          <div className="shrink-0 sm:ml-4">{detailAction}</div>
        ) : null}
      </CardContent>

      {canToggleTaskStatus(assignment.status) ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/40 bg-white/30 px-6 py-3 dark:border-white/5 dark:bg-white/5">
          <span className="text-sm text-neutral-600 dark:text-slate-400">
            Update status
          </span>
          <TaskStatusControl taskId={assignment.id} status={assignment.status} />
        </div>
      ) : null}
    </Card>
  );
};