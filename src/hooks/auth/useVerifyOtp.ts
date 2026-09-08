import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/lib/api/auth";
import { setResetToken } from "@/stores/passwordReset";

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (vars: { email: string; otp: string }) =>
      verifyOtp(vars.email, vars.otp),
    onSuccess: (data) => {
      setResetToken(data.resetToken);
    },
  });
}