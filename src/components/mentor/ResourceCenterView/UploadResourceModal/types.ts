import type { ResourceType } from "@/lib/types";

export interface UploadResourceModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (input:
    | { name: string; type: ResourceType; courseId?: string; url: string; visibility?: "PUBLIC" | "PRIVATE" }
    | { name: string; type: ResourceType; courseId?: string; file: File; visibility?: "PUBLIC" | "PRIVATE" }) => Promise<void>;
  courses: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  error?: string | null;
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
