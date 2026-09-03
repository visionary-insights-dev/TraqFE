import type { VerificationItem } from "@/lib/types";

export interface QueueItemProps {
  item: VerificationItem;
  isVerifying: boolean;
  onVerify: (id: string) => void;
  onRequestResubmission: (item: VerificationItem) => void;
}
