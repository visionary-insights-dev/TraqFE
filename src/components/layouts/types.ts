import { type HTMLAttributes, type ReactNode } from "react";

export interface AuthLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  visual?: ReactNode;
}

export interface ScholarLayoutProps {
  children: ReactNode;
}

export interface MentorLayoutProps {
  children: ReactNode;
}

export interface AdminLayoutProps {
  children: ReactNode;
}
