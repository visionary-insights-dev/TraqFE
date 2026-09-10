import { cn } from "@/lib/utils";
import type { ToggleProps } from "./types";

export const Toggle = ({
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
  ...props
}: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-11 w-16 shrink-0 items-center justify-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300",
          checked
            ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 shadow-inner shadow-amber-900/20 ring-2 ring-amber-400/40"
            : "bg-neutral-500 ring-1 ring-black/10 dark:bg-slate-600"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
    </button>
  );
};
