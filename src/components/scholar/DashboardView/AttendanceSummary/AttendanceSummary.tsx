import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import { cn } from "@/lib/utils";
import type { AttendanceSummaryProps } from "./types";

export const AttendanceSummary = ({
  attendance,
}: AttendanceSummaryProps) => {
  const belowTarget = attendance.rate < attendance.target;

  return (
    <Card
      className={cn(
        "glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl",
        belowTarget ? "ember-glow" : "brand-glow"
      )}
    >
      {/* Ambient aurora matching the status tone */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "ember-pulse absolute -top-20 -right-16 h-48 w-48 rounded-full blur-3xl",
            belowTarget
              ? "bg-warning/20 dark:bg-warning/15"
              : "bg-success/20 dark:bg-success/15"
          )}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardHeader className="flex items-center justify-between border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
        <div className="flex items-center gap-2">
          <CalendarCheck
            className="h-4 w-4 text-brand-600 dark:text-brand-300"
            aria-hidden="true"
          />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Attendance
          </h2>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
            belowTarget
              ? "bg-warning-light/80 text-warning-dark ring-warning/25 dark:bg-warning/15 dark:text-amber-300 dark:ring-warning/30"
              : "bg-success-light/80 text-success-dark ring-success/25 dark:bg-success/15 dark:text-green-300 dark:ring-success/30"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "ember-pulse h-1.5 w-1.5 rounded-full",
              belowTarget ? "bg-warning dark:bg-amber-400" : "bg-success dark:bg-green-300"
            )}
          />
          Target {Math.round(attendance.target)}%
        </span>
      </CardHeader>

      <CardContent className="relative space-y-3.5 px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "bg-gradient-to-br bg-clip-text text-4xl font-bold tabular-nums tracking-tight text-transparent",
              belowTarget
                ? "from-warning-dark to-warning dark:from-amber-300 dark:to-amber-500"
                : "from-success-dark to-success dark:from-green-300 dark:to-green-500"
            )}
          >
            {Math.round(attendance.rate)}%
          </span>
          <span className="text-sm text-neutral-500 dark:text-slate-400">
            of your meetings attended
          </span>
        </div>

        <ProgressBar
          value={attendance.rate}
          tone={belowTarget ? "warning" : "success"}
          aria-label="Attendance"
          className="h-2.5 bg-neutral-200/60 ring-1 ring-white/40 dark:bg-slate-700/60 dark:ring-white/10"
          barClassName={cn(
            "relative overflow-hidden",
            belowTarget
              ? "bg-gradient-to-r from-amber-400 to-amber-500"
              : "bg-gradient-to-r from-emerald-400 to-emerald-500"
          )}
        />

        {belowTarget ? (
          <p
            role="status"
            className="rounded-xl border border-warning/15 bg-warning-light/70 px-3.5 py-2.5 text-sm text-warning-dark shadow-sm backdrop-blur dark:border-warning/20 dark:bg-warning/10 dark:text-amber-300"
          >
            Your attendance is currently below the program target. Keep showing
            up to stay on track.
          </p>
        ) : (
          <p role="status" className="text-sm text-neutral-600 dark:text-slate-300">
            Nice work — you&apos;re meeting your attendance target.
          </p>
        )}
      </CardContent>
    </Card>
  );
};