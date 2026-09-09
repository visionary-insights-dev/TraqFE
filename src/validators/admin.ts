import { z } from "zod";

export const programSchema = z.object({
  name: z.string().min(2, "Program name is required"),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ProgramFormValues = z.output<typeof programSchema>;
export type ProgramFormInput = z.input<typeof programSchema>;

export const courseSchema = z.object({
  name: z.string().min(2, "Course name is required"),
  code: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[A-Z0-9-]{2,12}$/.test(value.trim()),
      { message: "Use 2–12 characters (A–Z, 0–9, dashes)" }
    ),
  programId: z.string().optional(),
});

export type CourseFormValues = z.output<typeof courseSchema>;
export type CourseFormInput = z.input<typeof courseSchema>;

export const adminAssignmentSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  dueAt: z.string().min(1, "Deadline is mandatory"),
  courseId: z.string().optional(),
  programId: z.string().optional(),
  audience: z.enum(["ALL", "COURSE", "PROGRAM"]).default("ALL"),
  mentorId: z.string().optional(),
});

export type AdminAssignmentFormValues = z.output<typeof adminAssignmentSchema>;
export type AdminAssignmentFormInput = z.input<typeof adminAssignmentSchema>;

/**
 * Progress weights MUST sum to exactly 100%. The refine powers the inline
 * error shown immediately on change and the UI blocks saving until valid.
 */
export const orgSettingsSchema = z
  .object({
    assignmentWeight: z.coerce
      .number({ message: "Enter a number" })
      .min(0, "Must be 0–100")
      .max(100, "Must be 0–100"),
    attendanceWeight: z.coerce
      .number({ message: "Enter a number" })
      .min(0, "Must be 0–100")
      .max(100, "Must be 0–100"),
    atRisk: z.object({
      attendancePct: z.coerce.number().min(0).max(100),
      assignmentPct: z.coerce.number().min(0).max(100),
      overdueCount: z.coerce.number().int().min(0),
    }),
    lateSubmissionPenaltyPct: z.coerce.number().min(0).max(100),
    assignmentEditWindowMinutes: z.coerce.number().int().min(1),
    attendance: z.object({
      excusedAllowed: z.boolean(),
      requireExcuseReason: z.boolean(),
      reminderHoursBefore: z.coerce.number().int().min(1).max(336),
    }),
  })
  .superRefine((data, ctx) => {
    const sum = data.assignmentWeight + data.attendanceWeight;
    const message =
      "Assignment and attendance weights must add up to exactly 100%.";
    if (sum !== 100) {
      ctx.addIssue({
        message,
        path: ["assignmentWeight"],
        code: z.ZodIssueCode.custom,
      });
      ctx.addIssue({
        message,
        path: ["attendanceWeight"],
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type OrgSettingsFormValues = z.output<typeof orgSettingsSchema>;
export type OrgSettingsFormInput = z.input<typeof orgSettingsSchema>;

export const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  role: z.enum(["SCHOLAR", "MENTOR"]),
  courseId: z.string().optional(),
});

export type InviteFormValues = z.output<typeof inviteSchema>;
export type InviteFormInput = z.input<typeof inviteSchema>;

export const reportSchema = z.object({
  name: z.string().min(2, "Report name is required"),
  programId: z.string().optional(),
  includeAtRisk: z.boolean().default(true),
});

export type ReportFormValues = z.output<typeof reportSchema>;
export type ReportFormInput = z.input<typeof reportSchema>;