import axios from "axios";
import { post, patch } from "./client";
import {
  type LoginPayload,
  type LoginResponse,
  type OnboardingInput,
  type UserProfile,
  type ResourceUploadUrl,
} from "@/lib/types";

export function login(input: LoginPayload): Promise<LoginResponse> {
  // rememberMe is a client-only UX preference. Sending it to the API is
  // rejected by the backend's strict DTO validation, so it never leaves the
  // client.
  return post<LoginResponse>("/auth/login", {
    email: input.email,
    password: input.password,
  });
}

export function magicLink(email: string): Promise<void> {
  return post<void>("/auth/magic-link", { email });
}

export function forgotPassword(email: string): Promise<void> {
  return post<void>("/auth/forgot-password", { email });
}

export function verifyOtp(
  email: string,
  otp: string
): Promise<{ resetToken: string }> {
  return post<{ resetToken: string }>("/auth/verify-otp", { email, otp });
}

export function resetPassword(
  token: string,
  password: string
): Promise<void> {
  return post<void>("/auth/reset-password", {
    resetToken: token,
    newPassword: password,
  });
}

export function logout(): Promise<void> {
  return post<void>("/auth/logout");
}

export function updateMyProfile(
  input: OnboardingInput
): Promise<UserProfile> {
  return patch<UserProfile>("/users/me/profile", input);
}

export function getProfileUploadUrl(
  filename: string,
  contentType: string
): Promise<ResourceUploadUrl> {
  return post<ResourceUploadUrl>("/resources/upload-url", {
    filename,
    contentType,
  });
}

export async function uploadFileDirect(
  uploadUrl: string,
  file: File
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
}
