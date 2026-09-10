import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
  className?: string;
}

export const AdminPageHeader = ({
  title,
  description,
  actions,
  eyebrow,
  className,
}: AdminPageHeaderProps) => {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
};