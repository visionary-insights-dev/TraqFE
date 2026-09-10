import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeProps } from "./types";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm",
  {
    variants: {
      variant: {
        neutral: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-300/40",
        blue: "bg-brand-100 text-brand-800 ring-1 ring-brand-500/20",
        amber: "bg-warning-light text-warning-dark ring-1 ring-amber-500/25",
        green: "bg-success-light text-success-dark ring-1 ring-success/25",
        orange: "bg-secondary-100 text-secondary-800 ring-1 ring-secondary-500/25",
        red: "bg-danger-light text-danger-dark ring-1 ring-danger/25",
        info: "bg-info-light text-info-dark ring-1 ring-info/25",
        outline: "border border-neutral-300 bg-white/60 text-neutral-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export const Badge = ({
  className,
  variant,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
};
