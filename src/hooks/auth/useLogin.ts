import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { setAccessToken, setUser } from "@/stores/auth";
import type { LoginPayload } from "@/lib/types";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginPayload) => login(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
  });
}