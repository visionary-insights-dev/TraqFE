"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, WifiOff } from "lucide-react";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useSocketEvents,
  useConnectivity,
} from "@/hooks";
import { queryKeys } from "@/hooks/keys";
import { getUser } from "@/stores/auth";
import { EmptyState, ErrorState } from "@/components/ui";
import { ScholarPageHeader } from "@/components/scholar/shared";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";

export const ChatView = () => {
  const isOnline = useConnectivity();
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLElement>(null);

  const conversationsQuery = useConversations();
  const messagesQuery = useMessages(activeId);
  const sendMessage = useSendMessage(activeId ?? "");
  const currentUser = getUser();

  useSocketEvents(["chat.message.new"], {
    invalidateKeys: [queryKeys.conversations],
  });

  // On mobile, when a thread opens the list is hidden; keep keyboard focus
  // inside the visible pane (thread header back button) and restore focus to
  // the conversation button when the user returns to the list.
  const lastOpenedRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;
    if (activeId) {
      lastOpenedRef.current = activeId;
      threadRef.current
        ?.querySelector<HTMLButtonElement>("[data-chat-back]")
        ?.focus();
    } else if (lastOpenedRef.current) {
      listRef.current
        ?.querySelector<HTMLButtonElement>(
          `[data-conv-id="${lastOpenedRef.current}"]`
        )
        ?.focus();
      lastOpenedRef.current = null;
    }
  }, [activeId]);

  const handleSelect = (id: string) => {
    setActiveId(id === activeId ? null : id);
  };

  const handleBack = () => setActiveId(null);

  const activeConversation = conversationsQuery.data?.find(
    (c) => c.id === activeId
  );

  if (conversationsQuery.isLoading) {
    return <ChatSkeleton />;
  }

  if (conversationsQuery.isError) {
    return (
      <ErrorState
        title="Could not load conversations"
        message="Something went wrong while loading your messages. Please try again."
        onRetry={() => conversationsQuery.refetch()}
      />
    );
  }

  const emptyConversations = !conversationsQuery.data;
  const listHiddenMobile = emptyConversations || !!activeId;
  const threadHiddenMobile = emptyConversations || !activeId;

  return (
    <div className="space-y-6">
      <ScholarPageHeader
        eyebrow="Messages"
        title="Messages"
        subtitle="Chat with your mentors and cohort."
      />

      {!isOnline ? (
        <div
          role="status"
          className="glass-surface flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-warning-dark shadow-sm dark:text-amber-300"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          You&apos;re offline. Messages can&apos;t be sent right now.
        </div>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[320px_1fr] lg:gap-6">
        {/* Conversation list */}
        <section
          ref={listRef}
          aria-label="Conversations"
          className={
            listHiddenMobile
              ? "hidden lg:block"
              : "block pane-enter lg:block"
          }
          hidden={emptyConversations}
        >
          {conversationsQuery.data && conversationsQuery.data.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-7 w-7" aria-hidden="true" />}
              title="No conversations yet"
              description="Messages from your mentors will appear here."
            />
          ) : conversationsQuery.data ? (
            <div className="glass-card glass-edge rounded-2xl p-2 lg:h-[calc(100vh-17rem)] lg:overflow-y-auto">
              <p className="px-3 pt-2 text-sm font-semibold text-neutral-600 dark:text-slate-400">
                {conversationsQuery.data.length} conversation
                {conversationsQuery.data.length === 1 ? "" : "s"}
              </p>
              <ConversationList
                conversations={conversationsQuery.data}
                activeId={activeId}
                onSelect={handleSelect}
              />
            </div>
          ) : null}
        </section>

        {/* Thread */}
        <section
          ref={threadRef}
          aria-label="Message thread"
          className={
            threadHiddenMobile
              ? "hidden lg:block"
              : "block pane-enter lg:block"
          }
          hidden={emptyConversations}
        >
          {activeConversation ? (
            <div className="glass-card glass-edge h-[calc(100vh-17rem)] overflow-hidden rounded-2xl">
              <MessageThread
                conversationName={activeConversation.name}
                messages={messagesQuery.data ?? []}
                currentUserId={currentUser?.id ?? ""}
                isLoading={messagesQuery.isLoading}
                isError={messagesQuery.isError}
                online={isOnline}
                onBack={handleBack}
                onRetry={() => messagesQuery.refetch()}
                onSend={(text) => sendMessage.mutate(text)}
                sending={sendMessage.isPending}
              />
            </div>
          ) : (
            <div className="hidden h-[calc(100vh-17rem)] items-center justify-center rounded-2xl border border-dashed border-neutral-300/80 bg-white/40 text-center text-sm text-neutral-500 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-400 lg:flex">
              Select a conversation to start chatting
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

function ChatSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading conversations"
    >
      <div className="space-y-2">
        <div className="skeleton-shimmer h-3 w-28 rounded-md" />
        <div className="skeleton-shimmer h-8 w-40 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-64 rounded-md" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6">
        <div className="space-y-2 rounded-2xl border border-white/40 bg-white/70 p-2 backdrop-blur dark:bg-white/5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg p-3"
            >
              <div className="skeleton-shimmer h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-4 w-1/2 rounded-md" />
                <div className="skeleton-shimmer h-3 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="skeleton-shimmer h-[calc(100vh-17rem)] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
