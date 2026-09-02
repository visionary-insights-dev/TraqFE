import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeProps } from "./types";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-neutral-100 text-neutral-700",
        blue: "bg-brand-100 text-brand-800",
        amber: "bg-warning-light text-warning-dark",
        green: "bg-success-light text-success-dark",
        orange: "bg-secondary-100 text-secondary-800",
        red: "bg-danger-light text-danger-dark",
        info: "bg-info-light text-info-dark",
        outline: "border border-neutral-300 text-neutral-700",
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
