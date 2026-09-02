import { type HTMLAttributes } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number | typeof Infinity;
  onDismiss?: () => void;
}
