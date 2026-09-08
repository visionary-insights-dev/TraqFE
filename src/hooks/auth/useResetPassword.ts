import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/api/auth";
import { clearResetState } from "@/stores/passwordReset";

export function useResetPassword() {
  return useMutation({
    mutationFn: (vars: { token: string; password: string }) =>
      resetPassword(vars.token, vars.password),
    onSuccess: () => {
      clearResetState();
    },
  });
}