import { useMutation } from "@tanstack/react-query";
import { updateMyProfile } from "@/lib/api/auth";
import { setUser } from "@/stores/auth";
import type { OnboardingInput, UserProfile } from "@/lib/types";

export function useOnboardingSubmit() {
  return useMutation({
    mutationFn: (input: OnboardingInput) => updateMyProfile(input),
    onSuccess: (profile: UserProfile) => {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        organizationId: "",
        avatarUrl: profile.avatarUrl,
        profileComplete: profile.profileComplete,
      });
    },
  });
}