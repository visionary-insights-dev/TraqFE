import { type HTMLAttributes, type ReactNode } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}
