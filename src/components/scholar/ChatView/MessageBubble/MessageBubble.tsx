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
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          mine
            ? "rounded-br-md bg-gradient-to-br from-brand-600 to-brand-700 text-white"
            : "rounded-bl-md bg-white text-neutral-900 ring-1 ring-neutral-200/70"
        )}
      >
        {!mine ? (
          <p className="mb-0.5 text-xs font-semibold text-brand-800">
            {message.senderName}
          </p>
        ) : null}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={cn(
            "mt-1 text-right text-xs",
            mine ? "font-medium text-white/90" : "font-medium text-neutral-600"
          )}
        >
          {formatTime(message.sentAt)}
        </p>
      </div>
    </li>
  );
};
