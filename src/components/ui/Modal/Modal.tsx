"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModalProps } from "./types";

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  ...props
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-md"
      : size === "lg"
        ? "max-w-2xl"
        : size === "xl"
          ? "max-w-4xl"
          : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      {...props}
    >
      <div
        className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "glass-card glass-edge relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl",
          sizeClass,
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/40 bg-gradient-to-br from-white/40 to-transparent px-5 py-4 dark:border-white/5">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-neutral-900 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p id="modal-description" className="mt-0.5 text-sm text-neutral-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-neutral-200 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
