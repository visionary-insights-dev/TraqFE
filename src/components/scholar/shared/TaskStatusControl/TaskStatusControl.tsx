"use client";

import { CircleDashed, Play } from "lucide-react";
import { useUpdateTaskStatus } from "@/hooks/scholar";
import { cn } from "@/lib/utils";
import type { AssignmentStatus } from "@/lib/types";
import type { TaskStatusControlProps } from "./types";

export const canToggleTaskStatus = (
  status: AssignmentStatus
): status is "NOT_STARTED" | "IN_PROGRESS" =>
  status === "NOT_STARTED" || status === "IN_PROGRESS";

export const TaskStatusControl = ({
  taskId,
  status,
}: TaskStatusControlProps) => {
  const mutation = useUpdateTaskStatus(taskId);
  const pending = mutation.isPending;

  if (!canToggleTaskStatus(status)) return null;

  const active: "NOT_STARTED" | "IN_PROGRESS" =
    (mutation.variables as "NOT_STARTED" | "IN_PROGRESS" | undefined) ?? status;

  const set = (next: "NOT_STARTED" | "IN_PROGRESS") => {
    if (pending || next === active) return;
    mutation.mutate(next);
  };

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Task status"
        className="glass-surface inline-flex rounded-xl p-0.5"
      >
        <StatusButton
          label="To do"
          icon={<CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />}
          active={active === "NOT_STARTED"}
          pending={pending}
          onClick={() => set("NOT_STARTED")}
        />
        <StatusButton
          label="Doing"
          icon={<Play className="h-3.5 w-3.5" aria-hidden="true" />}
          active={active === "IN_PROGRESS"}
          pending={pending}
          onClick={() => set("IN_PROGRESS")}
        />
      </div>
      {pending ? (
        <p className="sr-only" role="status">
          Updating task status…
        </p>
      ) : mutation.isError ? (
        <p className="sr-only" role="alert">
          Could not update task status. Please try again.
        </p>
      ) : null}
    </div>
  );
};

function StatusButton({
  label,
  icon,
  active,
  pending,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={pending}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.97]",
        active
          ? "bg-white text-neutral-900 shadow-md dark:bg-slate-800 dark:text-white"
          : "text-neutral-600 hover:text-neutral-900 dark:text-slate-400 dark:hover:text-white",
        pending && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        className={cn(
          "transition-colors duration-200",
          active
            ? label === "Doing"
              ? "text-amber-500"
              : "text-brand-600 dark:text-brand-300"
            : "text-neutral-400 dark:text-slate-500"
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}