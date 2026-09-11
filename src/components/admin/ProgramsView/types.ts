import type { Program } from "@/lib/types";

export interface ArchiveProgramModalProps {
  program: Program | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export interface UnarchiveProgramModalProps {
  program: Program | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error: string | null;
}