import { CheckCircle2, FileSearch, RotateCcw, Clock } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { formatDateTime, relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { QueueItemProps } from "./types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export const QueueItem = ({
  item,
  isVerifying,
  onVerify,
  onRequestResubmission,
}: QueueItemProps) => {
  return (
    <Card className="glass-card">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-warning/20 text-warning-dark">
            <FileSearch className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-neutral-900">
                {item.assignmentTitle}
              </p>
              <Badge variant="amber">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {item.late ? "Late" : "Pending review"}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700">
                {initials(item.scholarName)}
              </span>
              <span>{item.scholarName}</span>
              {item.courseName ? (
                <span className="text-neutral-400">· {item.courseName}</span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Submitted {relativeTime(item.submittedAt)} (
              {formatDateTime(item.submittedAt)})
            </p>
          </div>
        </div>

        {item.submissionUrl ? (
          <a
            href={item.submissionUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
          >
            View work
          </a>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-neutral-100 pt-3">
          <button
            type="button"
            onClick={() => onRequestResubmission(item)}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-secondary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-secondary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
            )}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Request Resubmission
          </button>
          <button
            type="button"
            onClick={() => onVerify(item.id)}
            disabled={isVerifying}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-success-dark px-4 text-sm font-medium text-white transition-colors hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success",
              isVerifying && "cursor-wait opacity-70"
            )}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {isVerifying ? "Verifying…" : "Verify"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
