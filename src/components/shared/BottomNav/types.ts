import { type HTMLAttributes } from "react";
import { type NavItem } from "../Sidebar/types";

export interface BottomNavItem extends Omit<NavItem, "icon"> {
  icon: NonNullable<NavItem["icon"]>;
  ariaLabel?: string;
}

export interface BottomNavProps extends HTMLAttributes<HTMLElement> {
  items: BottomNavItem[];
}
