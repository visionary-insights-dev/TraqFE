import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/utils/dates";
import type { ConversationListProps } from "./types";

export const ConversationList = ({
  conversations,
  activeId,
  onSelect,
}: ConversationListProps) => {
  return (
    <ul className="space-y-1">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        const initials = conversation.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              aria-current={isActive ? "true" : undefined}
              data-conv-active={isActive ? "true" : undefined}
              data-conv-id={conversation.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.99]",
                isActive
                  ? "bg-gradient-to-r from-brand-50 to-brand-50/40 shadow-sm ring-1 ring-brand-200"
                  : "hover:bg-white/70"
              )}
            >
              {conversation.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={conversation.avatarUrl}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                />
              ) : (
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ring-white",
                    isActive
                      ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white"
                      : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700"
                  )}
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-neutral-900">
                    {conversation.name}
                  </p>
                  {conversation.lastMessage ? (
                    <span className="shrink-0 text-xs font-medium text-neutral-500">
                      {relativeTime(conversation.lastMessage.at)}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      conversation.unreadCount > 0
                        ? "font-medium text-neutral-800"
                        : "text-neutral-500"
                    )}
                  >
                    {conversation.lastMessage?.text ?? "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 ? (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-brand-500 to-brand-700 px-1.5 text-xs font-bold text-white shadow-sm">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
