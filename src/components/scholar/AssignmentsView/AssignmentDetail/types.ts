import type { Assignment } from "@/lib/types";

export interface AssignmentDetailProps {
  assignment: Assignment | null;
  open: boolean;
  onClose: () => void;
  isOffline: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  error?: string | null;
}
