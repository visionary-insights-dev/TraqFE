"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastProps } from "./types";

const variantConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-success",
    barClass: "bg-success",
  },
  error: {
    icon: XCircle,
    iconClass: "text-danger",
    barClass: "bg-danger",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    barClass: "bg-warning",
  },
  info: {
    icon: Info,
    iconClass: "text-info",
    barClass: "bg-info",
  },
};

export const Toast = ({
  variant = "info",
  title,
  description,
  duration = 5000,
  onDismiss,
  className,
  ...props
}: ToastProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0 p-4 shadow-lg",
        className
      )}
      {...props}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", config.barClass)} aria-hidden="true" />
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClass)} aria-hidden="true" />
      <div className="flex-1 space-y-0.5">
        {title ? <p className="text-sm font-semibold text-neutral-900">{title}</p> : null}
        {description ? (
          <p className="text-sm text-neutral-600">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
};
