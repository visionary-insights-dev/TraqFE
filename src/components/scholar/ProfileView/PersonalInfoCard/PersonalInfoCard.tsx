import type { FormEvent } from "react";
import { Button, Card, CardContent, Input } from "@/components/ui";
import type { ScholarProfile } from "@/lib/types";

export interface PersonalInfoCardProps {
  profile: ScholarProfile;
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}

export const PersonalInfoCard = ({
  profile,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSave,
  saving,
  disabled,
}: PersonalInfoCardProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className="glass-card glass-edge relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:shadow-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/15"
      />
      <CardContent className="relative space-y-5">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Personal Information
        </h2>

        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-300/60 shadow-lg shadow-amber-500/20"
            />
          ) : (
            <div className="ember-glow flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-xl font-bold text-amber-950 shadow-md shadow-amber-500/30 ring-4 ring-amber-200/50 dark:ring-amber-400/20">
              {initials}
            </div>
          )}
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {profile.name}
            </p>
            <p className="text-sm text-neutral-600 dark:text-slate-400">
              {profile.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="profile-name"
            label="Full name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={disabled || saving}
          />
          <Input
            id="profile-phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            helperText="Used for program updates and urgent notices."
            disabled={disabled || saving}
          />
          <Button
            type="submit"
            loading={saving}
            disabled={disabled}
            className="w-full shadow-md sm:w-auto"
          >
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};