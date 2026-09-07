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
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardHeader
        className={cn(
          "border-b border-white/40 bg-gradient-to-r to-transparent",
          belowTarget
            ? "from-warning-light/50"
            : "from-success-light/50"
        )}
      >
        <h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900">
          <CalendarCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
          Attendance
        </h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "bg-clip-text text-4xl font-bold text-transparent",
              belowTarget
                ? "bg-gradient-to-br from-warning to-warning-dark"
                : "bg-gradient-to-br from-success to-success-dark"
            )}
          >
            {Math.round(attendance.rate)}%
          </span>
          <span className="text-sm text-neutral-600">
            Target {Math.round(attendance.target)}%
          </span>
        </div>
        <ProgressBar
          value={attendance.rate}
          tone={belowTarget ? "warning" : "success"}
          aria-label="Attendance"
          className="h-2.5 bg-white/80"
        />
        {belowTarget ? (
          <p className="rounded-md bg-warning-light px-3 py-2 text-sm text-warning-dark">
            Your attendance is currently below the program target. Keep showing
            up to stay on track.
          </p>
        ) : (
          <p className="text-sm text-neutral-600">
            Nice work — you&apos;re meeting your attendance target.
          </p>
        )}
      </CardContent>
    </Card>
  );
};