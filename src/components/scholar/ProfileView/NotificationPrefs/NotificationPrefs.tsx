import {
  BellRing,
  CalendarX2,
  MessageSquare,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Toggle } from "../Toggle";
import type { NotificationPreferences } from "@/lib/types";
import type { NotificationPrefsProps } from "./types";

const PREF_LABELS: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    key: "assignmentReminders",
    title: "Assignment reminders",
    description: "Get notified before an assignment is due.",
    icon: BellRing,
  },
  {
    key: "attendanceAlerts",
    title: "Attendance alerts",
    description: "Alerts when you're marked absent for a session.",
    icon: CalendarX2,
  },
  {
    key: "meetingReminders",
    title: "Meeting reminders",
    description: "Reminders before your next mentor check-in.",
    icon: Video,
  },
  {
    key: "messages",
    title: "Messages",
    description: "Notify you when you receive a new message.",
    icon: MessageSquare,
  },
];

export const NotificationPrefs = ({
  prefs,
  onChange,
  disabled,
}: NotificationPrefsProps) => {
  return (
    <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />
      <CardContent className="relative space-y-1">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Notification Preferences
        </h2>
        <p className="mb-4 text-sm text-neutral-600 dark:text-slate-400">
          Choose what you want to hear about.
        </p>
        <ul className="divide-y divide-white/40 dark:divide-white/5">
          {PREF_LABELS.map(({ key, title, description, icon: Icon }) => (
            <li
              key={key}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-slate-400">
                  {description}
                </p>
              </div>
              <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <Toggle
                checked={prefs[key]}
                onCheckedChange={onChange(key)}
                label={title}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};