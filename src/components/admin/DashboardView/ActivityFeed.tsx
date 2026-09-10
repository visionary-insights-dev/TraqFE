import {
  CalendarPlus,
  CheckCircle2,
  FileText,
  FolderArchive,
  Link2,
  Mail,
  Settings2,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { relativeTime } from "@/lib/utils";
import type { ActivityItem, ActivityType } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  SCHOLAR_JOINED: UserPlus,
  SCHOLAR_INVITED: Mail,
  MENTOR_PAIRED: Link2,
  ASSIGNMENT_PUBLISHED: FileText,
  ASSIGNMENT_VERIFIED: CheckCircle2,
  MEETING_SCHEDULED: CalendarPlus,
  PROGRAM_ARCHIVED: FolderArchive,
  SETTINGS_UPDATED: Settings2,
};

const SIGNATURE: Partial<Record<string, string>> = {
  SCHOLAR_JOINED: "bg-success-light text-success-dark",
  SCHOLAR_INVITED: "bg-info-light text-info-dark",
  MENTOR_PAIRED: "bg-brand-100 text-brand-700",
  ASSIGNMENT_PUBLISHED: "bg-brand-100 text-brand-700",
  ASSIGNMENT_VERIFIED: "bg-success-light text-success-dark",
  MEETING_SCHEDULED: "bg-warning-light text-warning-dark",
  PROGRAM_ARCHIVED: "bg-neutral-200 text-neutral-700",
  SETTINGS_UPDATED: "bg-neutral-100 text-neutral-600",
};

interface ActivityFeedProps {
  items: ActivityItem[];
  loading: boolean;
}

export const ActivityFeed = ({ items, loading }: ActivityFeedProps) => {
  return (
    <section className="glass-card overflow-hidden rounded-2xl" aria-labelledby="activity-heading">
      <header className="border-b border-neutral-200/70 px-5 py-4">
        <h2 id="activity-heading" className="text-sm font-semibold text-neutral-900">
          Recent activity
        </h2>
      </header>
      <div className="p-5">
        {loading ? (
          <div className="space-y-5" role="status" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton-shimmer h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton-shimmer h-3.5 w-2/3 rounded" />
                  <div className="skeleton-shimmer h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            No activity yet today.
          </p>
        ) : (
          <ol className="relative space-y-5 before:absolute before:inset-y-1 before:left-[17px] before:w-px before:bg-neutral-200">
            {items.map((item) => {
              const Icon = ICONS[item.type] ?? FileText;
              const iconClass = SIGNATURE[item.type] ?? "bg-brand-100 text-brand-700";
              const typeLabel = formatType(item.type);
              return (
                <li key={item.id} className="relative flex items-start gap-3">
                  <span
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-sm leading-snug text-neutral-700">
                      {item.description}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
                      <span className="font-medium capitalize">{typeLabel}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={item.at}>{relativeTime(item.at)}</time>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

function formatType(type: ActivityType | string): string {
  if (typeof type !== "string") return "activity";
  return type.toLowerCase().replaceAll("_", " ");
}