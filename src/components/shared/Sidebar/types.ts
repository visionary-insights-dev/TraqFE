import { type HTMLAttributes, type ReactNode, type ComponentType, type SVGProps } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
  badge?: ReactNode;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: NavItem[];
  brand?: ReactNode;
  footer?: ReactNode;
}
