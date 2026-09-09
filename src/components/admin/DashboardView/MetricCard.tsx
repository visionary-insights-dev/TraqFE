import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCountUp } from "./useCountUp";

export interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "brand" | "success" | "warning" | "danger" | "info" | "neutral";
  suffix?: string;
  helper?: ReactNode;
  subLabel?: string;
}

const toneConfig: Record<
  NonNullable<MetricCardProps["tone"]>,
  { iconBg: string; iconColor: string; glow: string }
> = {
  brand: {
    iconBg: "bg-brand-100",
    iconColor: "text-brand-700",
    glow: "",
  },
  success: {
    iconBg: "bg-success-light",
    iconColor: "text-success-dark",
    glow: "",
  },
  warning: {
    iconBg: "bg-warning-light",
    iconColor: "text-warning-dark",
    glow: "",
  },
  danger: {
    iconBg: "bg-danger-light",
    iconColor: "text-danger-dark",
    glow: "",
  },
  info: {
    iconBg: "bg-info-light",
    iconColor: "text-info-dark",
    glow: "",
  },
  neutral: {
    iconBg: "bg-neutral-100",
    iconColor: "text-neutral-700",
    glow: "",
  },
};

export const MetricCard = ({
  label,
  value,
  icon: Icon,
  tone = "brand",
  suffix,
  helper,
  subLabel,
}: MetricCardProps) => {
  const animated = useCountUp(value);
  const config = toneConfig[tone];

  return (
    <div className="glass-card group rounded-2xl p-5 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </p>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105",
            config.iconBg,
            config.iconColor
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 text-3xl font-bold tabular-nums tracking-tight text-neutral-900",
          tone === "danger" && "text-danger",
          tone === "warning" && "text-warning-dark",
          tone === "success" && "text-success-dark"
        )}
      >
        {animated.toLocaleString()}
        {suffix ? <span className="ml-0.5 text-lg font-semibold text-neutral-400">{suffix}</span> : null}
      </p>
      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}
      {subLabel ? (
        <p className="mt-1 text-xs font-medium text-neutral-400">{subLabel}</p>
      ) : null}
    </div>
  );
};