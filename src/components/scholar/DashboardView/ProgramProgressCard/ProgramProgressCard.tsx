import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { ProgressBar } from "@/components/scholar/shared";
import type { ProgramProgressCardProps } from "./types";

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const ProgramProgressCard = ({
  progress,
}: ProgramProgressCardProps) => {
  const overall = Math.round(progress.overall);
  const dashOffset = RING_CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, progress.overall)) / 100);

  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Ambient aurora behind the frosted surface */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="halo-drift absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-brand-400/25 via-violet-500/20 to-transparent blur-3xl" />
        <div className="ember-pulse absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
      </div>

      {/* Crisp light-catching rim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardHeader className="relative flex items-center justify-between border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-slate-400">
          Program progress
        </p>
        <Link
          href="/scholar/progress"
          className="rounded text-xs font-semibold text-brand-700 underline-offset-2 transition-colors hover:text-brand-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="relative space-y-5 px-5 pb-5 pt-4">
        <div className="flex items-center gap-5">
          {/* Halo ring */}
          <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
            <span
              aria-hidden="true"
              className="ember-pulse absolute -inset-1.5 rounded-full bg-gradient-to-br from-brand-400/35 via-violet-500/30 to-amber-400/30 blur-lg"
            />
            <svg
              viewBox="0 0 120 120"
              aria-hidden="true"
              className="relative h-full w-full -rotate-90"
            >
              <defs>
                <linearGradient id="halo-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-brand-400)" />
                  <stop offset="55%" stopColor="var(--color-violet-500)" />
                  <stop offset="100%" stopColor="var(--color-amber-400)" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="10"
                className="stroke-neutral-900/5 dark:stroke-white/10"
              />
              <circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                stroke="url(#halo-progress)"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className="text-xl font-bold tabular-nums tracking-tight text-neutral-900 sm:text-2xl dark:text-white"
              >
                {overall}%
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-slate-400">
                overall
              </span>
            </div>
          </div>

          {/* Weighted breakdown */}
          <dl className="min-w-0 flex-1 space-y-3.5">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <dt className="text-neutral-600 dark:text-slate-300">
                  Assignments{" "}
                  <span className="text-xs text-neutral-400 dark:text-slate-500">
                    ({progress.assignmentWeight}%)
                  </span>
                </dt>
                <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                  {Math.round(progress.assignmentPct)}%
                </dd>
              </div>
              <ProgressBar
                value={progress.assignmentPct}
                aria-label="Assignment progress"
                className="h-1.5 bg-neutral-200/60 dark:bg-slate-700/60"
                barClassName="bg-gradient-to-r from-brand-500 to-violet-500"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <dt className="text-neutral-600 dark:text-slate-300">
                  Attendance{" "}
                  <span className="text-xs text-neutral-400 dark:text-slate-500">
                    ({progress.attendanceWeight}%)
                  </span>
                </dt>
                <dd className="font-semibold tabular-nums text-neutral-900 dark:text-white">
                  {Math.round(progress.attendancePct)}%
                </dd>
              </div>
              <ProgressBar
                value={progress.attendancePct}
                aria-label="Attendance progress"
                className="h-1.5 bg-neutral-200/60 dark:bg-slate-700/60"
                barClassName="bg-gradient-to-r from-amber-400 to-amber-500"
              />
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
};