import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { AssignmentStatusBadge } from "@/components/scholar/shared";
import { formatDateTime } from "@/lib/utils";
import type { ActiveTasksListProps } from "./types";

export const ActiveTasksList = ({ tasks }: ActiveTasksListProps) => {
  if (tasks.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="border-b border-white/40">
          <h2 className="text-base font-semibold text-neutral-900">
            Active tasks
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">
            No active assignments right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/40">
        <h2 className="text-base font-semibold text-neutral-900">
          Active tasks
        </h2>
        <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
          {tasks.length}
        </span>
      </CardHeader>
      <ul role="list" className="divide-y divide-white/40">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors duration-200 hover:bg-white/60"
          >
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-medium text-neutral-900">
                {task.title}
              </p>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {task.status === "OVERDUE"
                    ? "Was due"
                    : "Due"}{" "}
                  {formatDateTime(task.dueAt)}
                </span>
              </div>
              {task.courseName ? (
                <p className="text-xs text-neutral-600">{task.courseName}</p>
              ) : null}
            </div>
            <div className="shrink-0">
              <AssignmentStatusBadge status={task.status} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};