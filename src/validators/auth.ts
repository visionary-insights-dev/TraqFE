import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.output<typeof loginSchema>;
export type LoginFormInput = z.input<typeof loginSchema>;

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export type MagicLinkFormValues = z.output<typeof magicLinkSchema>;
export type MagicLinkFormInput = z.input<typeof magicLinkSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.output<typeof forgotPasswordSchema>;
export type ForgotPasswordFormInput = z.input<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter all 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

export type OtpFormValues = z.output<typeof otpSchema>;
export type OtpFormInput = z.input<typeof otpSchema>;

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type NewPasswordFormValues = z.output<typeof newPasswordSchema>;
export type NewPasswordFormInput = z.input<typeof newPasswordSchema>;

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        value.trim() === "" ||
        /^[+()\-\s\d]{7,20}$/.test(value.trim()),
      { message: "Enter a valid phone number" }
    ),
  avatarUrl: z.string().url().optional(),
});

export type OnboardingFormValues = z.output<typeof onboardingSchema>;
export type OnboardingFormInput = z.input<typeof onboardingSchema>;
