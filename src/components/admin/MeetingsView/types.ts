import type { AdminCourse, Meeting } from "@/lib/types";

export interface MeetingFormModalProps {
  open: boolean;
  onClose: () => void;
  courses: Array<Pick<AdminCourse, "id" | "name">>;
  initial?: Meeting | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (input: { title: string; startsAt: string; courseId?: string }) => void;
}

export interface ArchiveMeetingModalProps {
  meeting: Meeting | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}