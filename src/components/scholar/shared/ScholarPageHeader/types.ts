import type { HTMLAttributes, ReactNode } from "react";

export interface ScholarPageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}