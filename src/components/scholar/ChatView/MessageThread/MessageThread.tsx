import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { ThreadHeader } from "../ThreadHeader";
import { MessageBubble } from "../MessageBubble";
import { Composer } from "../Composer";
import { EmptyState, ErrorState } from "@/components/ui";
import type { MessageThreadProps } from "./types";

export const MessageThread = ({
  conversationName,
  messages,
  currentUserId,
  isLoading,
  isError,
  online,
  onBack,
  onRetry,
  onSend,
  sending,
}: MessageThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, currentUserId]);

  return (
    <div className="flex h-full flex-col bg-white/50 dark:bg-slate-950/40">
      <ThreadHeader name={conversationName} onBack={onBack} />

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div
            className="space-y-3"
            role="status"
            aria-busy="true"
            aria-label="Loading messages"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card h-12 w-2/3 overflow-hidden rounded-2xl"
              >
                <div
                  className={`skeleton-shimmer h-full w-full ${
                    i % 2 === 0 ? "ml-auto" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center pt-8">
            <ErrorState
              title="Could not load messages"
              message="Something went wrong. Please try again."
              onRetry={onRetry}
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon={<MessageCircle className="h-7 w-7" aria-hidden="true" />}
              title="No messages yet"
              description="Say hello to start the conversation."
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mine={message.senderId === currentUserId}
              />
            ))}
          </ul>
        )}
        <div ref={bottomRef} />
      </div>

      {!online ? (
        <p className="glass-surface border-t border-amber-200/60 bg-warning-light/90 px-4 py-2 text-sm font-medium text-warning-dark dark:border-amber-400/10 dark:text-amber-300">
          You&apos;re offline. Messages can&apos;t be sent right now.
        </p>
      ) : null}

      <Composer onSend={onSend} disabled={!online || sending || isError} />
    </div>
  );
};
