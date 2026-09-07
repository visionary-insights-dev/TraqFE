import type { NotificationPreferences } from "@/lib/types";

export interface NotificationPrefsProps {
  prefs: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences) => (checked: boolean) => void;
  disabled: boolean;
}
