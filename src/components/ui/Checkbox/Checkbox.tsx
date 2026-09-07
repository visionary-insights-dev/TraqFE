import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../Label";
import type { CheckboxProps } from "./types";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      id,
      label,
      hideLabel = false,
      error,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const inputId = id;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-11 min-w-[44px] items-center">
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              className={cn(
                "peer h-11 w-11 cursor-pointer appearance-none rounded-md border border-neutral-300 bg-neutral-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-60 aria-checked:border-brand-600",
                className
              )}
              {...props}
            />
            {checked ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-brand-600"
              >
                <Check className="h-5 w-5" strokeWidth={3} />
              </span>
            ) : null}
          </span>
          {label ? (
            <Label
              htmlFor={inputId}
              className={cn(
                "cursor-pointer select-none",
                hideLabel && "sr-only"
              )}
            >
              {label}
            </Label>
          ) : null}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="pl-14 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
