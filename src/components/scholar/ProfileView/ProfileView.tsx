"use client";

import { useRef, useState } from "react";
import { WifiOff, CheckCircle2 } from "lucide-react";
import { useScholarProfile, useUpdateProfile, useConnectivity } from "@/hooks";
import { ErrorState, LoadingSpinner } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { NotificationPrefs } from "./NotificationPrefs";
import { AccountSecurity } from "./AccountSecurity";
import type { NotificationPreferences, ScholarProfile } from "@/lib/types";

const DEFAULT_PREFS: NotificationPreferences = {
  assignmentReminders: true,
  attendanceAlerts: true,
  meetingReminders: true,
  messages: true,
};

export const ProfileView = () => {
  const profileQuery = useScholarProfile();
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
      <ScholarPageHeader
        eyebrow="Profile"
        title="Profile & Settings"
        subtitle="Manage your personal details and preferences."
      />

      {!online ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
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
  profile: ScholarProfile;
  disabled: boolean;
}

const ProfileForm = ({ profile, disabled }: ProfileFormProps) => {
  const update = useUpdateProfile();
  const [name, setName] = useState(profile.name);
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
      { name: name.trim() || profile.name, phone: phone.trim() || undefined },
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
          className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-success-dark shadow-md dark:text-green-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Changes saved.
        </p>
      ) : null}

      <PersonalInfoCard
        profile={profile}
        name={name}
        phone={phone}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onSave={handleSavePersonal}
        saving={update.isPending}
        disabled={disabled || update.isPending}
      />

      <NotificationPrefs
        prefs={prefs}
        onChange={handlePrefChange}
        disabled={disabled || update.isPending}
      />

      <AccountSecurity email={profile.email} />
    </div>
  );
};
