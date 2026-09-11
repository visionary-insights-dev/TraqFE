import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { UpcomingMeetingCardProps } from "./types";

export const UpcomingMeetingCard = ({
  meeting,
}: UpcomingMeetingCardProps) => {
  return (
    <Card className="glass-card glass-edge group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* Amber ember — scholar energy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ember-pulse absolute -top-20 -left-14 h-44 w-44 rounded-full bg-gradient-to-br from-amber-400/20 to-brand-400/10 blur-3xl" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />

      <CardHeader className="flex-row items-center justify-between gap-2 border-b border-white/30 bg-transparent px-5 pt-4 dark:border-white/5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          Upcoming meeting
        </h2>
        <Link
          href="/scholar/meetings"
          className="rounded text-xs font-semibold text-brand-700 underline-offset-2 transition-colors hover:text-brand-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="relative flex items-start gap-3.5 px-5 pb-5 pt-4">
        <div className="relative shrink-0">
          <div
            className="group-hover:scale-105 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-amber-400 text-white shadow-lg transition-transform duration-300 ease-out"
            aria-hidden="true"
          >
            <CalendarDays className="h-5 w-5" />
          </div>
          <span className="ember-pulse absolute inset-0 -z-10 rounded-xl bg-amber-400/30 blur-md" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-semibold text-neutral-900 dark:text-white">
            {meeting.title}
          </p>
          <p className="text-sm text-neutral-600 dark:text-slate-300">
            {formatDateTime(meeting.startsAt)}
            {meeting.endsAt ? ` – ${formatDateTime(meeting.endsAt)}` : ""}
          </p>
          {meeting.courseName ? (
            <p className="text-sm text-neutral-500 dark:text-slate-400">
              {meeting.courseName}
            </p>
          ) : null}
          {meeting.mentor?.name ? (
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              with {meeting.mentor.name}
            </p>
          ) : null}
          {meeting.attendeeCount !== undefined ? (
            <p className="flex items-center gap-1.5 text-sm tabular-nums text-neutral-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {meeting.attendeeCount} scholar
              {meeting.attendeeCount === 1 ? "" : "s"} attending
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};