import type { VerificationItem } from "@/lib/types";

export interface ResubmissionModalProps {
  item: VerificationItem | null;
  open: boolean;
  onClose: () => void;
  onRequest: (item: VerificationItem, comment: string) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}
