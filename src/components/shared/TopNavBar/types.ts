import { type HTMLAttributes, type ReactNode } from "react";

export interface TopNavBarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}