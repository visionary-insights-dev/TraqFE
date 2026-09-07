import { ArrowLeft } from "lucide-react";
import type { ThreadHeaderProps } from "./types";

export const ThreadHeader = ({ name, onBack }: ThreadHeaderProps) => {
  return (
    <div className="flex items-center gap-3 border-b border-white/40 bg-gradient-to-r from-brand-50/60 to-transparent px-4 py-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          data-chat-back
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all duration-200 hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
      <h2 className="truncate text-lg font-semibold text-neutral-900">
        {name}
      </h2>
    </div>
  );
};
