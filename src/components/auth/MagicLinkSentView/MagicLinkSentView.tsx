"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMagicLink } from "@/hooks/useAuthMutations";
import { useCooldown } from "@/hooks/useCooldown";
import { Button } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { MailCheck, ArrowLeft, RefreshCw } from "lucide-react";

export const MagicLinkSentView = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const magicLinkMutation = useMagicLink();
  const cooldown = useCooldown(60);

  useEffect(() => {
    if (email) cooldown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage =
    magicLinkMutation.error instanceof ApiClientError
      ? magicLinkMutation.error.message
      : magicLinkMutation.isError
        ? "Unable to resend. Please try again."
        : null;

  const onResend = () => {
    if (!email || !cooldown.isReady) return;
    magicLinkMutation.mutate(email, {
      onSuccess: () => cooldown.start(),
    });
  };

  return (
    <AuthCard>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-light ring-1 ring-success/20">
          <MailCheck className="h-8 w-8 text-success-dark" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Check your inbox
        </h2>
        <p className="mt-2 max-w-sm text-neutral-600">
          We&apos;ve sent a magic link to{" "}
          <span className="font-medium text-neutral-900">{email || "your email"}</span>
          . Click the link to sign in.
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <div className="mt-6 space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={onResend}
          disabled={!cooldown.isReady}
          loading={magicLinkMutation.isPending}
        >
          <RefreshCw className="h-4 w-4" />
          {cooldown.isReady ? "Resend" : `Resend in ${cooldown.remaining}s`}
        </Button>
        <a
          href="/auth/sign-in"
          className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </a>
      </div>
    </AuthCard>
  );
};
