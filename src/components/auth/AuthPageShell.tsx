import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AuthCard } from "./AuthCard";

export const AuthPageShell = ({
  children,
  cardClassName,
}: {
  children: ReactNode;
  cardClassName?: string;
}) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-50">
        <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[36rem] w-[36rem] rounded-full bg-secondary-200/40 blur-3xl" />
      </div>
      <AuthCard className={cn("max-w-md", cardClassName)}>{children}</AuthCard>
    </div>
  );
};
