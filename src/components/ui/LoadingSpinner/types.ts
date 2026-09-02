import { type HTMLAttributes } from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}
