import { ArrowLeftRight, CalendarClock, Clock, FileText, Send } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { AssignmentStatusBadge } from "@/components/scholar/shared";
import { formatDateTime } from "@/lib/utils";
import { getEditWindowInfo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AssignmentRowProps } from "./types";

export const AssignmentRow = ({
  assignment,
  now,
  onOpen,
  onRequestChange,
}: AssignmentRowProps) => {
  const edit = getEditWindowInfo({
    publishedAt: assignment.publishedAt,
    now: new Date(now),
  });

  return (
    <Card className="glass-card">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                assignment.published
                  ? "bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800"
                  : "bg-neutral-100 text-neutral-600"
              )}
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">
                {assignment.title}
              </p>
              {assignment.description ? (
                <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">
                  {assignment.description}
                </p>
              ) : null}
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  Due {formatDateTime(assignment.dueAt)}
                </span>
                {assignment.courseName ? (
                  <span>{assignment.courseName}</span>
                ) : null}
                {typeof assignment.submissionCount === "number" &&
                typeof assignment.submissionTotal === "number" ? (
                  <span>
                    {assignment.submissionCount}/{assignment.submissionTotal}{" "}
                    submitted
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {assignment.published ? (
              <AssignmentStatusBadge status={assignment.status} />
            ) : (
              <Badge variant="outline">Draft</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-2 text-sm">
            {edit.published && edit.editable ? (
              <>
                <Clock
                  className="h-4 w-4 text-brand-600"
                  aria-hidden="true"
                />
                <span className="text-brand-700">
                  Edit window: {edit.remainingLabel}
                </span>
              </>
            ) : null}
            {edit.published && !edit.editable ? (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                Edit window closed
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {!assignment.published ? (
              <button
                type="button"
                onClick={() => onOpen(assignment.id)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-neutral-100 px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Publish
              </button>
            ) : edit.editable ? (
              <button
                type="button"
                onClick={() => onOpen(assignment.id)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRequestChange(assignment)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-secondary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
              >
                <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
                Request Change
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
