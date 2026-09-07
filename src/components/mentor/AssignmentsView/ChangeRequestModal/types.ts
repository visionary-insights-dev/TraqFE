import type { MentorAssignment } from "@/lib/types";

export interface ChangeRequestModalProps {
  assignment: MentorAssignment | null;
  open: boolean;
  onClose: () => void;
  onRequest: (assignmentId: string, message: string) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}
