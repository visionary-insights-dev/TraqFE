import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setAccessToken, setUser, setRemembered } from "@/stores/auth";
import type { LoginPayload } from "@/lib/types";

const roleHome: Record<string, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  MENTOR: "/mentor/scholars",
  SCHOLAR: "/scholar/dashboard",
};

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: LoginPayload) => {
      const res = await fetch("/api/traq/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.email, password: input.password }),
        credentials: "include", // send httpOnly cookie
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Login failed");
      }
      return data;
    },
    onSuccess: async (data, variables) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setRemembered(variables.rememberMe ?? false);

      // Set a FE-domain session cookie so the middleware can read the role
      // without needing the cross-origin refresh_token cookie from the BE.
      try {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: data.user.role,
            userId: data.user.id,
            organizationId: data.user.organizationId,
          }),
        });
      } catch {
        // If the session cookie fails, middleware won't be able to protect
        // routes — but the in-memory auth state is still valid for API calls.
      }

      if (data.user.profileComplete === false) {
        router.push("/auth/onboarding");
        return;
      }

      const dest = roleHome[data.user.role];
      router.push(dest ?? "/");
    },
  });
}
