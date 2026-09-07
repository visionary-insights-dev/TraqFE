import { Card, CardContent, CardHeader } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import type { ProgramProgressCardProps } from "./types";

export const ProgramProgressCard = ({
  progress,
}: ProgramProgressCardProps) => {
  return (
    <Card className="glass-card brand-glow transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardHeader className="border-b border-white/40 bg-gradient-to-r from-brand-500/10 to-transparent">
        <h2 className="text-base font-semibold text-neutral-900">
          Overall progress
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="bg-gradient-to-br from-brand-600 to-brand-800 bg-clip-text text-4xl font-bold text-transparent">
            {Math.round(progress.overall)}%
          </span>
          <span className="text-sm text-neutral-600">Program progress</span>
        </div>
        <ProgressBar
          value={progress.overall}
          aria-label="Overall progress"
          className="h-2.5 bg-white/80"
        />

        <dl className="space-y-2 border-t border-white/50 pt-4">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-neutral-600">
              Assignments ({progress.assignmentWeight}%)
            </dt>
            <dd className="font-medium text-neutral-900">
              {Math.round(progress.assignmentPct)}%
            </dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="text-neutral-600">
              Attendance ({progress.attendanceWeight}%)
            </dt>
            <dd className="font-medium text-neutral-900">
              {Math.round(progress.attendancePct)}%
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
