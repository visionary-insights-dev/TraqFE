import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../Label";
import type { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      label,
      required,
      error,
      helperText,
      hideLabel = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <Label htmlFor={inputId} required={required} className={hideLabel ? "sr-only" : undefined}>
            {label}
          </Label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            errorId && helperId
              ? `${errorId} ${helperId}`
              : errorId ?? helperId
          }
          className={cn(
            "h-10 w-full rounded-md border bg-neutral-0 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100",
            error
              ? "border-danger focus-visible:ring-danger"
              : "border-neutral-300 focus-visible:ring-brand-500",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        {helperText && !error ? (
          <p id={helperId} className="text-sm text-neutral-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
