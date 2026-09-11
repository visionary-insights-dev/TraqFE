import { cn } from "@/lib/utils";
import type { ScholarPageHeaderProps } from "./types";

export const ScholarPageHeader = ({
  eyebrow,
  title,
  subtitle,
  right,
  className,
  ...props
}: ScholarPageHeaderProps) => {
  return (
    <header
      className={cn("dash-enter relative overflow-hidden pt-1", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/10 via-violet-500/10 to-amber-400/10 blur-3xl"
      />
      <div className="relative flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-slate-400">
              <span
                aria-hidden="true"
                className="ember-pulse h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(245,158,11,0.5)]"
              />
              Scholar · {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 bg-gradient-to-br from-neutral-900 via-neutral-800 to-brand-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-neutral-600 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </header>
  );
};