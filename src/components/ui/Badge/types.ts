import { type HTMLAttributes, type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { type badgeVariants } from "./Badge";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
}
