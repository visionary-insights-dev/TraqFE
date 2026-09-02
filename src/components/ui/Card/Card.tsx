import { cn } from "@/lib/utils";
import type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from "./types";

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  className,
  children,
  ...props
}: CardHeaderProps) => {
  return (
    <div className={cn("border-b border-neutral-200 px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({
  className,
  children,
  ...props
}: CardContentProps) => {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  className,
  children,
  ...props
}: CardFooterProps) => {
  return (
    <div
      className={cn(
        "border-t border-neutral-200 bg-neutral-50 px-5 py-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
