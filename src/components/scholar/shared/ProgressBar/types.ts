import { type HTMLAttributes } from "react";

export type ProgressTone = "brand" | "success" | "warning" | "danger";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: ProgressTone;
  barClassName?: string;
}
