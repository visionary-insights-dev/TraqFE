import { isAfter, parseISO } from "date-fns";

/**
 * Minutes the mentor can still edit an assignment after publish before only a
 * "Request Change" action is allowed. Mirrors the org-configurable backend
 * window (default 60 minutes).
 */
export const DEFAULT_EDIT_WINDOW_MINUTES = 60;

interface EditWindowOptions {
  publishedAt?: string;
  now?: Date;
  windowMinutes?: number;
}

export interface EditWindowInfo {
  published: boolean;
  editable: boolean;
  requestable: boolean;
  remainingMs: number;
  remainingMinutes: number;
  remainingLabel: string;
}

/**
 * Computes whether a published assignment is still inside its edit window.
 * - Not yet published -> not editable, not requestable (creation is a draft).
 * - Published + within window -> editable, requestable false.
 * - Published + past window -> editable false, requestable true.
 */
export function getEditWindowInfo({
  publishedAt,
  now = new Date(),
  windowMinutes = DEFAULT_EDIT_WINDOW_MINUTES,
}: EditWindowOptions): EditWindowInfo {
  if (!publishedAt) {
    return {
      published: false,
      editable: false,
      requestable: false,
      remainingMs: 0,
      remainingMinutes: 0,
      remainingLabel: "",
    };
  }

  const published = parseISO(publishedAt);
  const windowEnd = published.getTime() + windowMinutes * 60_000;
  const remainingMs = Math.max(0, windowEnd - now.getTime());
  const editable = remainingMs > 0;

  return {
    published: true,
    editable,
    requestable: !editable,
    remainingMs,
    remainingMinutes: Math.ceil(remainingMs / 60_000),
    remainingLabel: formatCountdown(remainingMs),
  };
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    return `${hours}h ${remMin}m`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function isAfterPublish(publishedAt: string): boolean {
  return isAfter(new Date(), parseISO(publishedAt));
}
