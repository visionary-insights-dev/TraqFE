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
    <Card className="glass-card transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardContent className="space-y-5">
        <h2 className="text-lg font-semibold text-neutral-900">
          Personal Information
        </h2>

        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-100"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-xl font-bold text-white shadow-md ring-4 ring-brand-100">
              {initials}
            </div>
          )}
          <div>
            <p className="font-medium text-neutral-900">{profile.name}</p>
            <p className="text-sm text-neutral-600">{profile.email}</p>
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
