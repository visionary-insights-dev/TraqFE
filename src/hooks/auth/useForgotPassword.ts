import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/lib/api/auth";
import { setResetEmail } from "@/stores/passwordReset";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess: (_data, email) => {
      setResetEmail(email);
    },
  });
}