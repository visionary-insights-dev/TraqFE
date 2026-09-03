import { UserRound, Mail } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui";
import type { MentorCardProps } from "./types";

export const MentorCard = ({ mentor }: MentorCardProps) => {
  if (!mentor) return null;

  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl">
      <CardHeader className="border-b border-white/40">
        <h2 className="text-base font-semibold text-neutral-900">
          Your mentor
        </h2>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800 ring-1 ring-brand-200">
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
        <div className="space-y-0.5">
          <p className="font-medium text-neutral-900">{mentor.name}</p>
          {mentor.title ? (
            <p className="text-sm text-neutral-600">{mentor.title}</p>
          ) : null}
          <p className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Mail className="h-4 w-4" aria-hidden="true" />
            Mentor support
          </p>
        </div>
      </CardContent>
    </Card>
  );
};