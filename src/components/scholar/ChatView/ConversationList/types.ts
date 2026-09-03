import type { Conversation } from "@/lib/types";

export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}
