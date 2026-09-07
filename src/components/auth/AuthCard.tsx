import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const AuthCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "glass-card pane-enter relative w-full rounded-2xl px-6 py-8 sm:px-10 sm:py-10",
        className
      )}
    >
      {children}
    </div>
  );
};
