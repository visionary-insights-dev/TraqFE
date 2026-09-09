import { cn } from "@/lib/utils";
import type { SparklineProps } from "./types";

export const Sparkline = ({
  values,
  width = 120,
  height = 32,
  strokeColor,
  fillColor,
  ariaLabel,
  className,
}: SparklineProps) => {
  if (values.length === 0) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return { x, y };
  });
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel ?? "Trend line"}
      className={cn("block", className)}
    >
      <path
        d={areaPath}
        fill={fillColor ?? "var(--color-brand-100)"}
        opacity={0.6}
        aria-hidden="true"
      />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor ?? "var(--color-brand-600)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};