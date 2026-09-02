import { type FC } from "react";
import { cn } from "@/lib/utils";
import type { LoadingSpinnerProps } from "./types";

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = "md",
  label,
  className,
  ...props
}) => {
  const sizeClass =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-2 border-neutral-200 border-t-brand-600",
          sizeClass
        )}
        aria-hidden="true"
      />
      {label ? (
        <span className="text-sm text-neutral-500">{label}</span>
      ) : null}
      <span className="sr-only">Loading</span>
    </div>
  );
};
