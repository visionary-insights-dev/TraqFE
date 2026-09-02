import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../Button";
import type { ErrorStateProps } from "./types";

export const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  ...props
}: ErrorStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-danger-light bg-danger-light/40 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-light text-danger-dark">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
        {message ? (
          <p className="mx-auto max-w-sm text-sm text-neutral-600">{message}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
};
