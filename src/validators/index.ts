export {
  emailSchema,
  passwordSchema,
  loginSchema,
  magicLinkSchema,
  forgotPasswordSchema,
  otpSchema,
  newPasswordSchema,
  onboardingSchema,
} from "./auth";
export type {
  LoginFormValues,
  MagicLinkFormValues,
  ForgotPasswordFormValues,
  OtpFormValues,
  NewPasswordFormValues,
  OnboardingFormValues,
} from "./auth";
export {
  programSchema,
  courseSchema,
  adminAssignmentSchema,
  orgSettingsSchema,
  inviteSchema,
  reportSchema,
} from "./admin";
export type {
  ProgramFormValues,
  ProgramFormInput,
  CourseFormValues,
  CourseFormInput,
  AdminAssignmentFormValues,
  AdminAssignmentFormInput,
  OrgSettingsFormValues,
  OrgSettingsFormInput,
  InviteFormValues,
  InviteFormInput,
  ReportFormValues,
  ReportFormInput,
} from "./admin";
