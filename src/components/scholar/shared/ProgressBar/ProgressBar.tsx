import { cn } from "@/lib/utils";
import type { ProgressBarProps } from "./types";

export const ProgressBar = ({
  value,
  max = 100,
  className,
  barClassName,
  tone = "brand",
  "aria-label": ariaLabel,
  ...props
}: ProgressBarProps) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const barTone =
    tone === "success"
      ? "bg-success-dark"
      : tone === "warning"
        ? "bg-warning-dark"
        : tone === "danger"
          ? "bg-danger"
          : "bg-brand-600";

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? `Progress: ${Math.round(pct)}%`}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-neutral-200",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all", barTone, barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
