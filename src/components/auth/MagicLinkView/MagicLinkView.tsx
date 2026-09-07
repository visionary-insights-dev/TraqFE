"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMagicLink } from "@/hooks/useAuthMutations";
import { magicLinkSchema, type MagicLinkFormInput } from "@/validators/auth";
import { Button, Input } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { ArrowLeft, Mail } from "lucide-react";

export const MagicLinkView = () => {
  const router = useRouter();
  const magicLinkMutation = useMagicLink();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<MagicLinkFormInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  const errorMessage =
    magicLinkMutation.error instanceof ApiClientError
      ? magicLinkMutation.error.message
      : magicLinkMutation.isError
        ? "Unable to send. Please try again."
        : null;

  const onSubmit = () => {
    const email = getValues("email");
    magicLinkMutation.mutate(email, {
      onSuccess: () => {
        router.push(`/auth/magic-link-sent?email=${encodeURIComponent(email)}`);
      },
    });
  };

  return (
    <AuthCard>
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
          <Mail className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Get a magic link
        </h2>
        <p className="mt-1 text-neutral-600">
          We&apos;ll email you a secure link to sign in instantly — no password
          needed.
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
          loading={magicLinkMutation.isPending}
        >
          Send Magic Link
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
