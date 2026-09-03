import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getConversations, getMessages, sendMessage } from "@/lib/api/scholar";
import { queryKeys } from "./keys";

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: getConversations,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId ?? ""),
    queryFn: () => getMessages(conversationId as string),
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}
