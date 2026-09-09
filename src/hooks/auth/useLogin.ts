import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { setAccessToken, setRemembered, setUser } from "@/stores/auth";
import type { LoginPayload } from "@/lib/types";

const roleHome: Record<string, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  MENTOR: "/mentor/scholars",
  SCHOLAR: "/scholar/dashboard",
};

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginPayload) => login(input),
    onSuccess: (data, variables) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setRemembered(variables.rememberMe ?? false);

      if (data.user.profileComplete === false) {
        router.push("/auth/onboarding");
        return;
      }

      const dest = roleHome[data.user.role];
      router.push(dest ?? "/");
    },
  });
}