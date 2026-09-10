import { useMutation } from "@tanstack/react-query";
import { updateMyProfile } from "@/lib/api/auth";
import { refreshAccessToken } from "@/lib/api";
import { setUser } from "@/stores/auth";
import type { OnboardingInput, UserProfile } from "@/lib/types";

export function useOnboardingSubmit() {
  return useMutation({
    mutationFn: (input: OnboardingInput) => updateMyProfile(input),
    onSuccess: async (profile: UserProfile) => {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        organizationId: "",
        avatarUrl: profile.avatarUrl,
        profileComplete: profile.profileComplete,
      });
      // Refresh the token so the JWT claims reflect the completed profile.
      // Without this the middleware still sees the stale profileComplete:false
      // in the refresh-token cookie and redirects back to onboarding when the
      // user tries to reach the dashboard.
      try {
        await refreshAccessToken();
      } catch {
        // Non-fatal — the user can still navigate manually if needed.
      }
    },
  });
}