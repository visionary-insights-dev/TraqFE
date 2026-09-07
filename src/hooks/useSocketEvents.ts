import { useEffect, useRef } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { connectSocket } from "@/lib/api/socket";
import { getUser } from "@/stores/auth";

interface SocketOptions {
  invalidateKeys?: QueryKey[];
  onEvent?: (event: string) => void;
}

/**
 * Keeps the latest callback in a ref so the socket subscription effect does not
 * re-subscribe every time the callback identity changes. The ref is only read
 * and written inside effects, never during render.
 */
function useLatestCallback<T extends unknown[]>(cb: (...args: T) => void) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);
  return cbRef;
}

/**
 * Subscribes the scholar's socket to a set of live event names. On each event
 * it invalidates the given query keys (or every query if none given) and calls
 * the optional per-event callback. Connects lazily to the user:{userId} room.
 */
export function useSocketEvents(
  events: string[],
  { invalidateKeys = [], onEvent }: SocketOptions = {}
): void {
  const queryClient = useQueryClient();
  const onEventRef = useLatestCallback(onEvent ?? (() => {}));

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    const socket = connectSocket(user.id);

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
