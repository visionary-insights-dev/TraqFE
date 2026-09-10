import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { useState } from "react";
import type { ComposerProps } from "./types";

export const Composer = ({ onSend, disabled }: ComposerProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-white/40 bg-white/60 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/40"
    >
      <label htmlFor="chat-message" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-message"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        aria-describedby="chat-message-hint"
        className="min-h-11 flex-1 resize-none rounded-xl border border-white/60 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-500 transition-all duration-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
          }
        }}
      />
      <p id="chat-message-hint" className="sr-only">
        Press Enter to send, Shift+Enter for a new line.
      </p>
      <button
        type="submit"
        disabled={disabled || text.trim().length === 0}
        aria-label="Send message"
        className="ember-glow flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 shadow-md shadow-amber-500/30 transition-all duration-200 hover:from-amber-500 hover:to-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-95"
      >
        <Send className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
};
