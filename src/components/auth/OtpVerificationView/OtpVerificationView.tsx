"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOtp, useForgotPassword } from "@/hooks/useAuthMutations";
import { useCooldown } from "@/hooks/useCooldown";
import { getResetEmail } from "@/stores/passwordReset";
import { Button } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

const OTP_LENGTH = 6;

export const OtpVerificationView = () => {
  const router = useRouter();
  const email = getResetEmail() ?? "";
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const verifyOtpMutation = useVerifyOtp();
  const forgotPasswordMutation = useForgotPassword();
  const cooldown = useCooldown(60);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (email) cooldown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH;
  const isPending = verifyOtpMutation.isPending || forgotPasswordMutation.isPending;

  const errorMessage =
    (verifyOtpMutation.error ?? forgotPasswordMutation.error) instanceof
    ApiClientError
      ? (
          (verifyOtpMutation.error ?? forgotPasswordMutation.error) as ApiClientError
        ).message
      : verifyOtpMutation.isError || forgotPasswordMutation.isError
        ? "Unable to verify the code. Please try again."
        : null;

  const handleChange = (index: number, value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digitsOnly;
    setDigits(next);

    if (digitsOnly && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const onSubmit = () => {
    if (!isComplete || !email) return;
    verifyOtpMutation.mutate(
      { email, otp },
      { onSuccess: () => router.push("/auth/new-password") }
    );
  };

  const onResend = () => {
    if (!email || !cooldown.isReady) return;
    forgotPasswordMutation.mutate(email, { onSuccess: () => cooldown.start() });
  };

  return (
    <AuthCard>
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
          <ShieldCheck className="h-6 w-6 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Verify your identity
        </h2>
        <p className="mt-1 text-neutral-600">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-neutral-900">
            {email || "your email"}
          </span>
          .
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <div className="mt-6 space-y-6">
        <div
          className="flex justify-between gap-2"
          role="group"
          aria-label="One-time code"
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
              maxLength={2}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isPending}
              className="h-14 w-full rounded-md border border-neutral-300 bg-neutral-0 text-center text-xl font-bold text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-100"
            />
          ))}
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={onSubmit}
          disabled={!isComplete}
          loading={isPending}
        >
          Verify
        </Button>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onResend}
            disabled={!cooldown.isReady || isPending}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            <RefreshCw className="h-4 w-4" />
            {cooldown.isReady ? "Resend code" : `Resend in ${cooldown.remaining}s`}
          </button>
          <a
            href="/auth/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Change email
          </a>
        </div>
      </div>
    </AuthCard>
  );
};
