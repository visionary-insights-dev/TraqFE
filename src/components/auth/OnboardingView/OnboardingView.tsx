"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOnboardingSubmit } from "@/hooks/useAuthMutations";
import {
  onboardingSchema,
  type OnboardingFormInput,
} from "@/validators/auth";
import { getProfileUploadUrl, uploadFileDirect } from "@/lib/api/auth";
import { Button, Input } from "@/components/ui";
import { AuthCard, AuthErrorBanner } from "@/components/auth";
import { ApiClientError } from "@/lib/api";
import { UserRound, Camera, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const OnboardingView = () => {
  const router = useRouter();
  const onboardingMutation = useOnboardingSubmit();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", phone: "" },
  });

  let errorMessage: string | null = null;
  if (onboardingMutation.error instanceof ApiClientError) {
    errorMessage = onboardingMutation.error.message;
  } else if (onboardingMutation.isError) {
    errorMessage = "Unable to save your profile. Please try again.";
  } else if (uploadError) {
    errorMessage = uploadError;
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image must be 20 MB or smaller.");
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { uploadUrl, publicUrl } = await getProfileUploadUrl(
        file.name,
        file.type
      );
      await uploadFileDirect(uploadUrl, file);
      setAvatarUrl(publicUrl);
    } catch {
      setUploadError("Unable to upload your photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (values: OnboardingFormInput) => {
    onboardingMutation.mutate(
      {
        name: values.name,
        phone: values.phone || undefined,
        avatarUrl,
      },
      { onSuccess: () => router.push("/auth/onboarding/success") }
    );
  };

  return (
    <AuthCard className="max-w-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Complete your profile
        </h2>
        <p className="mt-1 text-neutral-600">
          Tell us a bit about yourself to get started.
        </p>
      </div>

      <AuthErrorBanner message={errorMessage} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Upload profile photo"
            className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-neutral-100 ring-2 ring-neutral-200 transition hover:ring-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoPreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-10 w-10 text-neutral-400" />
            )}
            {uploading ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </span>
            ) : (
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white transition group-hover:bg-brand-700">
                <Camera className="h-4 w-4" />
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="sr-only"
            tabIndex={-1}
          />
          <span className="text-sm text-neutral-500">
            {photoPreview ? "Change photo" : "Add a profile photo"}
          </span>
        </div>

        <Input
          id="name"
          type="text"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          id="phone"
          type="tel"
          label="Phone number"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={onboardingMutation.isPending}
        >
          Get Started
        </Button>
      </form>
    </AuthCard>
  );
};
