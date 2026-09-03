"use client";

import { useRef, useState } from "react";
import { CheckCircle2, WifiOff } from "lucide-react";
import { useMentorProfile, useUpdateMentorProfile } from "@/hooks/useMentorProfile";
import { useConnectivity } from "@/hooks/useConnectivity";
import { Button, Card, CardContent, ErrorState, Input, LoadingSpinner } from "@/components/ui";
import { Toggle } from "./Toggle";
import type { MentorProfile, NotificationPreferences } from "@/lib/types";

const DEFAULT_PREFS: NotificationPreferences = {
  assignmentReminders: true,
  attendanceAlerts: true,
  meetingReminders: true,
  messages: true,
};

export const MentorProfileView = () => {
  const profileQuery = useMentorProfile();
  const online = useConnectivity();

  if (profileQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading your profile" />
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ErrorState
        title="Couldn't load your profile"
        message="Something went wrong loading your profile. Please try again."
        onRetry={() => profileQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Profile &amp; Settings
        </h1>
        <p className="mt-1 text-neutral-600">
          Manage your personal details and preferences.
        </p>
      </div>

      {!online ? (
        <div
          role="status"
          className="glass-surface mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Changes can&apos;t be saved until you reconnect.
        </div>
      ) : null}

      <ProfileForm profile={profileQuery.data} disabled={!online} />
    </div>
  );
};

interface ProfileFormProps {
  profile: MentorProfile;
  disabled: boolean;
}

const ProfileForm = ({ profile, disabled }: ProfileFormProps) => {
  const update = useUpdateMentorProfile();
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    ...DEFAULT_PREFS,
    ...profile.notificationPreferences,
  });
  const [saved, setSaved] = useState(false);
  const savedAt = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaved = () => {
    setSaved(true);
    if (savedAt.current) clearTimeout(savedAt.current);
    savedAt.current = setTimeout(() => setSaved(false), 2500);
  };

  const handleSavePersonal = () => {
    update.mutate(
      {
        name: name.trim() || profile.name,
        title: title.trim() || undefined,
        phone: phone.trim() || undefined,
      },
      { onSuccess: showSaved }
    );
  };

  const handlePrefChange =
    (key: keyof NotificationPreferences) => (checked: boolean) => {
      setPrefs((current) => ({ ...current, [key]: checked }));
      update.mutate(
        { notificationPreferences: { [key]: checked } },
        { onSuccess: showSaved }
      );
    };

  return (
    <div className="space-y-6">
      {saved ? (
        <p
          role="status"
          className="inline-flex items-center gap-2 rounded-full bg-success-light px-4 py-2 text-sm font-semibold text-success-dark shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Changes saved.
        </p>
      ) : null}

      <Card className="glass-card">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Personal Information
          </h2>
          <Input
            id="mentor-name"
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="mentor-title"
              label="Title / Role"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              id="mentor-phone"
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input id="mentor-email" label="Email" value={profile.email} disabled />
          <Button
            type="button"
            onClick={handleSavePersonal}
            loading={update.isPending}
            disabled={disabled || update.isPending}
          >
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Notification Preferences
          </h2>
          <NotificationPrefs
            prefs={prefs}
            onChange={handlePrefChange}
            disabled={disabled || update.isPending}
          />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent>
          <h2 className="text-lg font-semibold text-neutral-900">
            Account &amp; Security
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Manage the security of your account.
          </p>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              onClick={() => {}}
            >
              Change password
            </button>
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              onClick={() => {}}
            >
              Two-factor authentication
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface NotificationPrefsProps {
  prefs: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences) => (checked: boolean) => void;
  disabled: boolean;
}

const NotificationPrefs = ({ prefs, onChange, disabled }: NotificationPrefsProps) => {
  const rows: Array<{
    key: keyof NotificationPreferences;
    label: string;
    description: string;
  }> = [
    {
      key: "assignmentReminders",
      label: "Assignment reminders",
      description: "Get notified when assignments are created.",
    },
    {
      key: "attendanceAlerts",
      label: "Attendance alerts",
      description: "Receive alerts about attendance updates.",
    },
    {
      key: "meetingReminders",
      label: "Meeting reminders",
      description: "Remind me before upcoming meetings.",
    },
    {
      key: "messages",
      label: "Messages",
      description: "Notify me of new messages.",
    },
  ];

  return (
    <ul className="divide-y divide-neutral-100">
      {rows.map((row) => (
        <li
          key={row.key}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-neutral-900">{row.label}</p>
            <p className="text-sm text-neutral-600">{row.description}</p>
          </div>
          <Toggle
            checked={prefs[row.key]}
            onCheckedChange={onChange(row.key)}
            label={row.label}
            disabled={disabled}
          />
        </li>
      ))}
    </ul>
  );
};
