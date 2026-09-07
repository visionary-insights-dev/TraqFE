export interface PersonalInfoCardProps {
  profile: import("@/lib/types").ScholarProfile;
  name: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}
