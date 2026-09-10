import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ThreadHeaderProps } from "./types";

export const ThreadHeader = ({ name, onBack }: ThreadHeaderProps) => {
  return (
    <div className="relative flex items-center gap-3 overflow-hidden border-b border-white/40 bg-gradient-to-r from-brand-50/70 via-white/40 to-transparent px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:from-brand-500/10 dark:via-slate-900/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/20"
      />
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          data-chat-back
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-600 transition-all duration-200 hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 lg:hidden dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
      <div className="relative min-w-0">
        <p
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-slate-400"
          )}
        >
          <span
            aria-hidden="true"
            className="ember-pulse h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_2px_rgba(245,158,11,0.5)]"
          />
          Chat
        </p>
        <h2 className="truncate text-lg font-semibold text-neutral-900 dark:text-white">
          {name}
        </h2>
      </div>
    </div>
  );
};