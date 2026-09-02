export const USER_ROLES = ["SUPER_ADMIN", "MENTOR", "SCHOLAR"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
}
