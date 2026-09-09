import { cn } from "@/lib/utils";
import type { ProgressRingProps } from "./types";

const toneStrokes: Record<string, string> = {
  brand: "stroke-brand-600",
  success: "stroke-success-dark",
  warning: "stroke-warning-dark",
  danger: "stroke-danger",
};

export const ProgressRing = ({
  value,
  size = 64,
  strokeWidth = 6,
  tone = "brand",
  label,
  className,
}: ProgressRingProps) => {
  const pct = Math.min(100, Math.max(0, value));
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={label ?? `Progress: ${Math.round(pct)}%`}
      className={cn("inline-block -rotate-90", className)}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        className="stroke-neutral-200"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        className={cn(
          "stroke-linecap-round transition-[stroke-dashoffset] duration-500 ease-out",
          toneStrokes[tone] ?? toneStrokes.brand
        )}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
      />
    </svg>
  );
};