import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  magicLink,
  resetPassword,
  verifyOtp,
  updateMyProfile,
} from "@/lib/api/auth";
import {
  setAccessToken,
  setUser,
} from "@/stores/auth";
import {
  setResetToken,
  setResetEmail,
  clearResetState,
} from "@/stores/passwordReset";
import type {
  LoginPayload,
  OnboardingInput,
  UserProfile,
} from "@/lib/types";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginPayload) => login(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
  });
}

export function useMagicLink() {
  return useMutation({
    mutationFn: (email: string) => magicLink(email),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (vars: { email: string; otp: string }) =>
      verifyOtp(vars.email, vars.otp),
    onSuccess: (data) => {
      setResetToken(data.resetToken);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (vars: { token: string; password: string }) =>
      resetPassword(vars.token, vars.password),
    onSuccess: () => {
      clearResetState();
    },
  });
}

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

export { setResetEmail };
