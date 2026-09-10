import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils/dates";
import type { MessageBubbleProps } from "./types";

export const MessageBubble = ({ message, mine }: MessageBubbleProps) => {
  return (
    <li
      className={cn("flex", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          mine
            ? "rounded-br-md bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-brand-500/20"
            : "rounded-bl-md bg-white text-neutral-900 shadow-neutral-300/40 ring-1 ring-neutral-200/70 dark:bg-slate-800 dark:text-white dark:ring-white/10"
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-3 right-4 h-6 w-12 rounded-full blur-xl",
            mine
              ? "bg-amber-400/20"
              : "bg-violet-500/10"
          )}
        />
        {!mine ? (
          <p className="mb-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
            {message.senderName}
          </p>
        ) : null}
        <p className="relative whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={cn(
            "relative mt-1 text-right text-xs",
            mine ? "font-medium text-white/90" : "font-medium text-neutral-500 dark:text-slate-400"
          )}
        >
          {formatTime(message.sentAt)}
        </p>
      </div>
    </li>
  );
};