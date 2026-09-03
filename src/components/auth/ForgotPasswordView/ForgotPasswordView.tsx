"use client";

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useAuthMutations";
import { setResetEmail } from "@/stores/passwordReset";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormInput,
} from "@/validators/auth";
import { Button, Input } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { ArrowLeft, KeyRound } from "lucide-react";

export const ForgotPasswordView = () => {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const errorMessage =
    forgotPasswordMutation.error instanceof ApiClientError
      ? forgotPasswordMutation.error.message
      : forgotPasswordMutation.isError
        ? "Unable to send reset link. Please try again."
        : null;

  const onSubmit = () => {
    const email = getValues("email");
    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        setResetEmail(email);
        router.push("/auth/otp-verification");
      },
    });
  };

  return (
    <AuthCard>
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
          <KeyRound className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Forgot your password?
        </h2>
        <p className="mt-1 text-neutral-600">
          Enter your email and we&apos;ll send you a one-time code to reset it.
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={forgotPasswordMutation.isPending}
        >
          Send Reset Code
        </Button>
      </form>

      <div className="mt-6">
        <a
          href="/auth/sign-in"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </a>
      </div>
    </AuthCard>
  );
};
