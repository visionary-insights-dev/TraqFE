import { Clock, CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui";
import {
  AssignmentStatusBadge,
  TaskStatusControl,
  canToggleTaskStatus,
} from "@/components/scholar/shared";
import { formatDateTime } from "@/lib/utils";
import type { ActiveTasksListProps } from "./types";

const DELAYS = ["dash-1", "dash-2", "dash-3", "dash-4", "dash-5"];

export const ActiveTasksList = ({ tasks }: ActiveTasksListProps) => {
  if (tasks.length === 0) {
    return (
      <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
        />
        <CardHeader className="flex items-center justify-between border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Active tasks
          </h2>
        </CardHeader>
        <CardContent className="px-5 py-4">
          <p className="text-sm text-neutral-500 dark:text-slate-400">
            No active assignments right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardHeader className="flex flex-row items-center justify-between border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Active tasks
          </h2>
          <span className="pill-shine flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2 py-0.5 text-xs font-bold tabular-nums text-amber-950 shadow-md shadow-amber-500/30">
            {tasks.length}
          </span>
        </div>
        <Link
          href="/scholar/assignments"
          className="rounded text-xs font-semibold text-brand-700 underline-offset-2 transition-colors hover:text-brand-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
        >
          View all
        </Link>
      </CardHeader>

      <ul role="list" className="relative divide-y divide-white/30 dark:divide-white/5">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className={`dash-enter group flex items-center justify-between gap-3 px-5 py-3.5 transition-colors duration-200 hover:bg-white/50 dark:hover:bg-slate-800/40 ${DELAYS[index % DELAYS.length]}`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(245,158,11,0.45)]"
              />
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-sm font-medium text-neutral-900 transition-colors group-hover:text-neutral-950 dark:text-slate-100 dark:group-hover:text-white">
                  {task.title}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {task.status === "OVERDUE" ? "Was due" : "Due"}{" "}
                    {formatDateTime(task.dueAt)}
                  </span>
                </div>
                {task.courseName ? (
                  <p className="flex items-center gap-1 text-xs text-neutral-600 dark:text-slate-500">
                    <CornerDownLeft
                      className="h-3 w-3 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    {task.courseName}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="shrink-0">
              {canToggleTaskStatus(task.status) ? (
                <TaskStatusControl taskId={task.id} status={task.status} />
              ) : (
                <AssignmentStatusBadge status={task.status} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};