"use client";

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuthMutations";
import { getResetToken, clearResetState } from "@/stores/passwordReset";
import {
  newPasswordSchema,
  type NewPasswordFormInput,
} from "@/validators/auth";
import { Button, Input } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { Lock } from "lucide-react";

export const NewPasswordView = () => {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();
  const token = getResetToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const errorMessage =
    resetPasswordMutation.error instanceof ApiClientError
      ? resetPasswordMutation.error.message
      : resetPasswordMutation.isError
        ? "Unable to reset password. Please try again."
        : null;

  const onSubmit = (values: NewPasswordFormInput) => {
    if (!token) {
      router.replace("/auth/forgot-password");
      return;
    }
    resetPasswordMutation.mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          clearResetState();
          router.push("/auth/sign-in");
        },
      }
    );
  };

  if (!token) {
    return (
      <AuthCard>
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
            Reset session expired
          </h2>
          <p className="mt-1 text-neutral-600">
            Your session has expired. Please request a new reset code.
          </p>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.replace("/auth/forgot-password")}
        >
          Start Over
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
          <Lock className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Set a new password
        </h2>
        <p className="mt-1 text-neutral-600">
          Choose a strong password you don&apos;t use elsewhere.
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
        <Input
          id="password"
          type="password"
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={resetPasswordMutation.isPending}
        >
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
};
