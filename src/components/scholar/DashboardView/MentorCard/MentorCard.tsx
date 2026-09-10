import { UserRound, Mail, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import type { MentorCardProps } from "./types";

export const MentorCard = ({ mentor }: MentorCardProps) => {
  if (!mentor) return null;

  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Violet aura — mentor pair warmth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ember-pulse absolute -bottom-20 -right-14 h-44 w-44 rounded-full bg-gradient-to-br from-violet-500/20 to-brand-400/10 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardHeader className="flex items-center justify-between border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Your mentor
        </h2>
        <Sparkles
          className="h-4 w-4 text-amber-400 transition-transform duration-300 ease-out group-hover:rotate-12"
          aria-hidden="true"
        />
      </CardHeader>

      <CardContent className="relative flex items-center gap-3.5 px-5 pb-5 pt-4">
        <div className="relative shrink-0">
          <span
            aria-hidden="true"
            className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-violet-500/40 to-amber-400/40 blur-[3px]"
          />
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-100 to-violet-200 text-brand-800 ring-2 ring-white/70 shadow-inner dark:from-slate-800 dark:to-slate-700 dark:text-brand-200 dark:ring-white/10">
            {mentor.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mentor.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-semibold text-neutral-900 dark:text-white">
            {mentor.name}
          </p>
          {mentor.title ? (
            <p className="text-sm text-neutral-600 dark:text-slate-300">
              {mentor.title}
            </p>
          ) : null}
          <p className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-slate-400">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Mentor support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};