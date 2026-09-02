import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../LoadingSpinner";
import { type ButtonProps } from "./types";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
        secondary:
          "bg-secondary-500 text-white hover:bg-secondary-600 focus-visible:ring-secondary-400",
        outline:
          "border border-neutral-300 bg-transparent text-neutral-800 hover:bg-neutral-50 focus-visible:ring-neutral-400",
        ghost:
          "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-300",
        danger:
          "bg-danger text-white hover:bg-danger-dark focus-visible:ring-danger",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : null}
      {children}
    </button>
  );
};
