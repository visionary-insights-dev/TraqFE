import { Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export const AuthBrandPanel = () => {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-10 xl:p-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-secondary-500/20 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">
          Traq
        </span>
      </div>

      <div className="relative space-y-6">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
          Manage programs, scholars, and outcomes in one place.
        </h1>
        <p className="max-w-md text-lg text-brand-100/90">
          Traq helps teams run scholarship and learning programs end to end —
          with clarity at every step.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <Sparkles className="h-4 w-4 text-secondary-300" />
            </div>
            <span className="text-sm text-brand-50/90">
              Role-specific experiences for admins, mentors, and scholars
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <ShieldCheck className="h-4 w-4 text-secondary-300" />
            </div>
            <span className="text-sm text-brand-50/90">
              Secure, fast, and built for impact
            </span>
          </div>
        </div>
      </div>

      <p className="relative text-sm text-brand-200/60">
        &copy; {new Date().getFullYear()} Traq. All rights reserved.
      </p>
    </div>
  );
};
