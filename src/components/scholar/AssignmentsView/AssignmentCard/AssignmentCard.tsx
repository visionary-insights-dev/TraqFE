import { CalendarClock, ChevronRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { AssignmentStatusBadge } from "@/components/scholar/shared";
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
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105",
            isOverdue
              ? "bg-gradient-to-br from-danger-light to-danger/15 text-danger-dark"
              : "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800"
          )}
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-neutral-900">
            {assignment.title}
          </p>
          <AssignmentStatusBadge status={assignment.status} />
        </div>

        {assignment.description ? (
          <p
            className="mt-1 line-clamp-2 text-sm text-neutral-600"
            title={assignment.description}
          >
            {assignment.description}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
            {isOverdue ? "Was due" : "Due"}{" "}
            {formatDateTime(assignment.dueAt)}
          </span>
          {assignment.courseName ? (
            <span>{assignment.courseName}</span>
          ) : null}
        </div>
      </div>

      {onOpen ? (
        <ChevronRight
          className="h-5 w-5 shrink-0 text-neutral-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
    </Card>
  );
};
