import { KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { AccountSecurityProps } from "./types";

export const AccountSecurity = ({ email }: AccountSecurityProps) => {
  return (
    <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />
      <CardContent className="relative space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Account &amp; Security
        </h2>

        <dl className="space-y-3 text-sm">
          <div className="glass-chip flex items-center justify-between gap-4 rounded-xl px-4 py-3">
            <dt className="text-neutral-600 dark:text-slate-400">
              Sign-in email
            </dt>
            <dd className="font-medium text-neutral-900 dark:text-white">
              {email}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5 border-t border-white/40 pt-3 dark:border-white/5">
          <button
            type="button"
            className="group inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.99] dark:text-slate-300 dark:hover:bg-white/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition-colors duration-200 group-hover:bg-amber-400 group-hover:text-amber-950 dark:bg-amber-400/20 dark:text-amber-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            Change password
          </button>
          <button
            type="button"
            className="group inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.99] dark:text-slate-300 dark:hover:bg-white/10"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/20 dark:text-brand-300">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </span>
            Two-factor authentication
          </button>
        </div>
      </CardContent>
    </Card>
  );
};