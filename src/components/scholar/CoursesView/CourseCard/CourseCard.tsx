import { BookOpen, CalendarCheck, CheckCircle2, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { ProgressBar, AssignmentStatusBadge } from "@/components/scholar/shared";
import { relativeTime } from "@/lib/utils/dates";
import type { CourseCardProps } from "./types";

export const CourseCard = ({ course }: CourseCardProps) => {
  const { assignmentsTotal } = course.progress;

  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{course.name}</p>
              <p className="text-sm text-neutral-600">{course.program.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="bg-gradient-to-br from-brand-600 to-brand-800 bg-clip-text text-3xl font-bold text-transparent">
              {Math.round(course.progress.overall)}%
            </p>
            <p className="text-sm text-neutral-600">Overall progress</p>
          </div>
        </div>

        <ProgressBar
          value={course.progress.overall}
          aria-label={`${course.name} overall progress`}
          className="h-2.5 bg-white/80"
        />

        <dl className="grid grid-cols-2 gap-3 border-t border-white/50 pt-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2">
            <CheckCircle2
              className="h-4 w-4 shrink-0 text-success-dark"
              aria-hidden="true"
            />
            <div>
              <dt className="text-neutral-600">Assignments</dt>
              <dd className="font-medium text-neutral-900">
                {course.progress.assignmentPct}%{" "}
                <span className="font-normal text-neutral-600">
                  ({assignmentsTotal ? `${course.progress.assignmentsCompleted}/${assignmentsTotal}` : ""})
                </span>
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2">
            <CalendarCheck
              className="h-4 w-4 shrink-0 text-brand-600"
              aria-hidden="true"
            />
            <div>
              <dt className="text-neutral-600">Attendance</dt>
              <dd className="font-medium text-neutral-900">
                {course.progress.attendancePct}%
              </dd>
            </div>
          </div>
        </dl>

        {course.mentor ? (
          <div className="flex items-center gap-2 border-t border-white/50 pt-4 text-sm text-neutral-600">
            <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Mentor: <span className="font-medium text-neutral-900">{course.mentor.name}</span>
            </span>
          </div>
        ) : null}

        {course.recentTasks.length > 0 ? (
          <div className="border-t border-white/50 pt-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">
              Recent tasks
            </h2>
            <ul className="space-y-2">
              {course.recentTasks.map((task) => (
                <li
                  key={task.id}
                  aria-label={`${task.title}, due ${relativeTime(task.dueAt)}`}
                  className="flex min-h-[44px] items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-white/60"
                >
                  <span className="min-w-0 truncate text-neutral-700">
                    {task.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <time
                      dateTime={task.dueAt}
                      className="text-sm text-neutral-600"
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
