import type { ChatMessage } from "@/lib/types";

export interface MessageBubbleProps {
  message: ChatMessage;
  mine: boolean;
}
