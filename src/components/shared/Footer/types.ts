import { type HTMLAttributes, type ReactNode } from "react";

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
  year?: number;
}