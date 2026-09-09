import { useQuery, type QueryKey } from "@tanstack/react-query";

export const TASK_STATUSES = ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TERMINAL_STATUSES: ReadonlySet<string> = new Set([
  "COMPLETED",
  "FAILED",
]);

interface AsyncTask {
  id: string;
  status: TaskStatus;
}

interface AsyncTaskOptions {
  intervalMs?: number;
  enabled?: boolean;
}

/**
 * Polls an async task (202 Accepted → completion) using TanStack Query's
 * conditional refetchInterval. Polling stops once the task reaches a terminal
 * status (COMPLETED / FAILED).
 */
export function useAsyncTask<T extends AsyncTask>(
  queryKey: QueryKey,
  fetchFn: (id: string) => Promise<T>,
  id: string | null | undefined,
  options: AsyncTaskOptions = {}
) {
  const intervalMs = options.intervalMs ?? 2500;
  return useQuery({
    queryKey,
    queryFn: () => fetchFn(id as string),
    enabled: Boolean(id) && (options.enabled ?? true),
    refetchInterval: (query) => {
      const data = query.state.data as T | undefined;
      if (!data || !TERMINAL_STATUSES.has(data.status)) return intervalMs;
      return false;
    },
  });
}