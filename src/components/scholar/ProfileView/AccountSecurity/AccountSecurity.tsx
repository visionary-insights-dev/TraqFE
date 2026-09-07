import { KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { AccountSecurityProps } from "./types";

export const AccountSecurity = ({ email }: AccountSecurityProps) => {
  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">
          Account &amp; Security
        </h2>

        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 px-4 py-3">
            <dt className="text-neutral-600">Sign-in email</dt>
            <dd className="font-medium text-neutral-900">{email}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5 border-t border-white/40 pt-3">
          <button
            type="button"
            className="group inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <ShieldCheck
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            Change password
          </button>
          <button
            type="button"
            className="group inline-flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 transition-colors group-hover:bg-secondary-500 group-hover:text-white">
              <KeyRound
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            Two-factor authentication
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
