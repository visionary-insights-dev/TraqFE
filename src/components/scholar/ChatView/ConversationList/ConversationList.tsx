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
                "relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-[0.99]",
                isActive
                  ? "ember-glow bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/25"
                  : "hover:bg-white/70 dark:hover:bg-white/5"
              )}
            >
              {conversation.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={conversation.avatarUrl}
                  alt=""
                  className={cn(
                    "h-11 w-11 shrink-0 rounded-full object-cover ring-2 transition-all duration-300",
                    isActive
                      ? "ring-white/60"
                      : "ring-white dark:ring-white/20"
                  )}
                />
              ) : (
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 transition-transform duration-300 group-hover:scale-105",
                    isActive
                      ? "bg-white/25 text-amber-950 ring-white/60"
                      : "bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700 ring-white dark:from-slate-700 dark:to-slate-800 dark:text-slate-200 dark:ring-white/20"
                  )}
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate font-medium",
                      isActive
                        ? "text-amber-950"
                        : "text-neutral-900 dark:text-white"
                    )}
                  >
                    {conversation.name}
                  </p>
                  {conversation.lastMessage ? (
                    <span
                      className={cn(
                        "shrink-0 text-xs font-medium",
                        isActive
                          ? "text-amber-950/80"
                          : "text-neutral-500 dark:text-slate-400"
                      )}
                    >
                      {relativeTime(conversation.lastMessage.at)}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      isActive
                        ? "font-medium text-amber-950/80"
                        : conversation.unreadCount > 0
                          ? "font-medium text-neutral-800 dark:text-slate-100"
                          : "text-neutral-500 dark:text-slate-400"
                    )}
                  >
                    {conversation.lastMessage?.text ?? "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 ? (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold shadow-md",
                        isActive
                          ? "bg-white/30 text-amber-950"
                          : "ember-glow bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 shadow-amber-500/40"
                      )}
                    >
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