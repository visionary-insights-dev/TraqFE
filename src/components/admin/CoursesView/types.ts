import type { AdminCourse, Program } from "@/lib/types";

export interface CourseFormModalProps {
  open: boolean;
  onClose: () => void;
  programs: Program[];
  initial?: AdminCourse | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (input: { name: string; code?: string; programId?: string }) => void;
}

export interface ArchiveCourseModalProps {
  course: AdminCourse | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}