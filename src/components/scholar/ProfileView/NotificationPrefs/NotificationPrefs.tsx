import { Card, CardContent } from "@/components/ui";
import { Toggle } from "../Toggle";
import type { NotificationPreferences } from "@/lib/types";
import type { NotificationPrefsProps } from "./types";

const PREF_LABELS: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: "assignmentReminders",
    title: "Assignment reminders",
    description: "Get notified before an assignment is due.",
  },
  {
    key: "attendanceAlerts",
    title: "Attendance alerts",
    description: "Alerts when you're marked absent for a session.",
  },
  {
    key: "meetingReminders",
    title: "Meeting reminders",
    description: "Reminders before your next mentor check-in.",
  },
  {
    key: "messages",
    title: "Messages",
    description: "Notify you when you receive a new message.",
  },
];

export const NotificationPrefs = ({
  prefs,
  onChange,
  disabled,
}: NotificationPrefsProps) => {
  return (
    <Card className="glass-card transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardContent className="space-y-1">
        <h2 className="text-lg font-semibold text-neutral-900">
          Notification Preferences
        </h2>
        <p className="mb-4 text-sm text-neutral-600">
          Choose what you want to hear about.
        </p>
        <ul className="divide-y divide-white/50">
          {PREF_LABELS.map(({ key, title, description }) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{title}</p>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
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
