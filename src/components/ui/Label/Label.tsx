import { cn } from "@/lib/utils";
import type { LabelProps } from "./types";

export const Label = ({
  className,
  children,
  required = false,
  ...props
}: LabelProps) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-neutral-800",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
};
