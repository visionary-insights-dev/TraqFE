import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";
import type { UpcomingMeetingCardProps } from "./types";

export const UpcomingMeetingCard = ({
  meeting,
}: UpcomingMeetingCardProps) => {
  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardHeader className="border-b border-white/40">
        <h2 className="text-base font-semibold text-neutral-900">
          Upcoming meeting
        </h2>
      </CardHeader>
      <CardContent className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-0.5">
          <p className="font-medium text-neutral-900">{meeting.title}</p>
          <p className="text-sm text-neutral-600">
            {formatDateTime(meeting.startsAt)}
            {meeting.endsAt ? ` – ${formatDateTime(meeting.endsAt)}` : ""}
          </p>
          {meeting.courseName ? (
            <p className="text-sm text-neutral-500">{meeting.courseName}</p>
          ) : null}
          {meeting.mentor?.name ? (
            <p className="text-sm font-medium text-brand-700">
              with {meeting.mentor.name}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
