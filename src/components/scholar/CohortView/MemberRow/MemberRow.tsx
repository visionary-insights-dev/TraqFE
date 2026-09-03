import { GraduationCap, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemberRowProps } from "./types";

export const MemberRow = ({ member }: MemberRowProps) => {
  const isMentor = member.role === "MENTOR";
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="group flex items-center gap-4 rounded-xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      {member.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.avatarUrl}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
        />
      ) : (
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white transition-transform duration-300 group-hover:scale-105",
            isMentor
              ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md"
              : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700"
          )}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{member.name}</p>
        <p className="flex items-center gap-1 text-sm text-neutral-600">
          {isMentor ? (
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {isMentor ? "Mentor" : "Scholar"}
        </p>
      </div>
    </li>
  );
};
