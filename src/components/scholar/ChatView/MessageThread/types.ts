import type { ChatMessage } from "@/lib/types";

export interface MessageThreadProps {
  conversationName: string;
  messages: ChatMessage[];
  currentUserId: string;
  isLoading: boolean;
  isError: boolean;
  online: boolean;
  onBack?: () => void;
  onRetry: () => void;
  onSend: (text: string) => void;
  sending: boolean;
}
