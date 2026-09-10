import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { ProgressBar, AssignmentStatusBadge } from "@/components/scholar/shared";
import { relativeTime } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import type { CourseCardProps } from "./types";

export const CourseCard = ({ course }: CourseCardProps) => {
  const { assignmentsTotal } = course.progress;

  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Ambient aurora */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="halo-drift absolute -top-20 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-brand-400/15 via-violet-500/10 to-transparent blur-3xl" />
        <div className="ember-pulse absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardContent className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-amber-400 text-white shadow-lg transition-transform duration-300 ease-out group-hover:scale-105">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="ember-pulse absolute inset-0 -z-10 rounded-xl bg-amber-400/30 blur-md" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">
                {course.name}
              </p>
              <p className="text-sm text-neutral-600 dark:text-slate-400">
                {course.program.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="bg-gradient-to-br from-amber-500 via-amber-500 to-brand-700 bg-clip-text text-3xl font-bold tabular-nums text-transparent">
              {Math.round(course.progress.overall)}%
            </p>
            <p className="text-sm text-neutral-600 dark:text-slate-400">
              Overall progress
            </p>
          </div>
        </div>

        <ProgressBar
          value={course.progress.overall}
          aria-label={`${course.name} overall progress`}
          className="h-2.5 bg-neutral-200/60 ring-1 ring-white/40 dark:bg-slate-700/60 dark:ring-white/10"
          barClassName="bar-shine bg-gradient-to-r from-brand-500 via-brand-600 to-violet-500"
        />

        <dl className="grid grid-cols-2 gap-3 border-t border-white/40 pt-4 text-sm dark:border-white/5">
          <div className="glass-chip flex items-center gap-2.5 rounded-xl px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-light text-success-dark dark:bg-success/15 dark:text-green-300">
              <CheckCircle2
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            </span>
            <div>
              <dt className="text-neutral-600 dark:text-slate-400">
                Assignments
              </dt>
              <dd className="font-medium text-neutral-900 dark:text-white">
                {course.progress.assignmentPct}%{" "}
                <span className="font-normal text-neutral-600 dark:text-slate-400">
                  ({assignmentsTotal
                    ? `${course.progress.assignmentsCompleted}/${assignmentsTotal}`
                    : ""}
                  )
                </span>
              </dd>
            </div>
          </div>
          <div className="glass-chip flex items-center gap-2.5 rounded-xl px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
              <CalendarCheck
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            </span>
            <div>
              <dt className="text-neutral-600 dark:text-slate-400">
                Attendance
              </dt>
              <dd className="font-medium text-neutral-900 dark:text-white">
                {course.progress.attendancePct}%
              </dd>
            </div>
          </div>
        </dl>

        {course.mentor ? (
          <div className="flex items-center gap-2.5 border-t border-white/40 pt-4 text-sm text-neutral-600 dark:border-white/5 dark:text-slate-400">
<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-500/20 dark:text-brand-300">
  <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
</span>
            <span>
              Mentor:{" "}
              <span className="font-medium text-amber-700 dark:text-amber-300">
                {course.mentor.name}
              </span>
            </span>
          </div>
        ) : null}

        {course.recentTasks.length > 0 ? (
          <div className="border-t border-white/40 pt-4 dark:border-white/5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
              Recent tasks
              <span className="pill-shine flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-950 shadow-md shadow-amber-500/30">
                {course.recentTasks.length}
              </span>
            </h2>
            <ul className="space-y-1.5">
              {course.recentTasks.map((task) => (
                <li
                  key={task.id}
                  aria-label={`${task.title}, due ${relativeTime(task.dueAt)}`}
                  className={cn(
                    "flex min-h-[44px] items-center justify-between gap-3 rounded-xl px-2.5 py-1.5 text-sm transition-all duration-200",
                    "hover:bg-white/60 hover:shadow-sm dark:hover:bg-white/5"
                  )}
                >
                  <span className="min-w-0 truncate text-neutral-700 dark:text-slate-300">
                    {task.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <time
                      dateTime={task.dueAt}
                      className="text-sm text-neutral-600 dark:text-slate-400"
                    >
                      due {relativeTime(task.dueAt)}
                    </time>
                    <AssignmentStatusBadge status={task.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};