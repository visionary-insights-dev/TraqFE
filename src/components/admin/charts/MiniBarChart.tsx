import { cn } from "@/lib/utils";
import type { MiniBarChartProps } from "./types";

const barTones: Record<string, string> = {
  brand: "bg-brand-600",
  success: "bg-success-dark",
  warning: "bg-warning-dark",
  danger: "bg-danger",
};

export const MiniBarChart = ({
  data,
  height = 120,
  max,
  showValues = true,
  className,
}: MiniBarChartProps) => {
  const maxValue = max ?? Math.max(...data.map((d) => d.value), 1);
  const labelRowHeight = 18;
  const valueLabelHeight = showValues ? 18 : 0;
  const chartHeight = height - labelRowHeight;
  const barAreaHeight = chartHeight - valueLabelHeight;

  return (
    <div role="img" aria-label="Bar chart" className={cn("flex flex-col", className)}>
      <div className="flex items-end gap-3" style={{ height: chartHeight }}>
        {data.map((d) => {
          const scaled =
            valueLabelHeight > 0
              ? (d.value / maxValue) * barAreaHeight
              : (d.value / maxValue) * chartHeight;
          const barHeight = Math.max(4, Math.round(scaled));
          return (
            <div
              key={d.label}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
            >
              {showValues ? (
                <span className="text-xs font-semibold tabular-nums text-neutral-700">
                  {d.value}
                </span>
              ) : null}
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-500 ease-out",
                  barTones[d.tone ?? "brand"] ?? barTones.brand
                )}
                style={{ height: barHeight }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex gap-3">
        {data.map((d) => (
          <span
            key={d.label}
            className="min-w-0 flex-1 truncate text-center text-[10px] leading-tight text-neutral-500"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};