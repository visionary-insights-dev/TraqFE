import { useEffect, useRef } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { connectAdminSocket } from "@/lib/api/socket";
import { getUser } from "@/stores/auth";

interface AdminSocketOptions {
  invalidateKeys?: QueryKey[];
  onEvent?: (event: string) => void;
}

function useLatestCallback(cb: (event: string) => void) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);
  return cbRef;
}

/**
 * Subscribes the admin's socket to live events on the
 * `organization:{orgId}:admins` room and invalidates the given query keys
 * when one fires. Connects lazily and joins both the personal and org rooms.
 */
export function useAdminSocketEvents(
  events: string[],
  { invalidateKeys = [], onEvent }: AdminSocketOptions = {}
): void {
  const queryClient = useQueryClient();
  const onEventRef = useLatestCallback(onEvent ?? (() => {}));

  useEffect(() => {
    const user = getUser();
    if (!user || !user.organizationId) return;

    const socket = connectAdminSocket(user.id, user.organizationId);

    const handlers = events.map((event) => {
      const handler = () => {
        if (invalidateKeys.length > 0) {
          invalidateKeys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: key })
          );
        } else {
          queryClient.invalidateQueries();
        }
        onEventRef.current(event);
      };
      socket.on(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => socket.off(event, handler));
    };
    // invalidateKeys is intentionally excluded: the ref keeps the callback
    // fresh, and events/queryClient/onEventRef are stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, queryClient, onEventRef]);
}