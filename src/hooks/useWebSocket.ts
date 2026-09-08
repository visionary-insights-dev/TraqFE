import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket } from "@/lib/api/socket";
import { getUser } from "@/stores/auth";
import { queryKeys } from "./keys";

export interface WebSocketNotification {
  title?: string;
  message?: string;
}

/**
 * Global socket subscription. Connects to the authenticated user's room on
 * mount and routes live events to the query cache (invalidation) and to the
 * optional notification callback (for toasts / the notification bell).
 */
export function useWebSocket(
  onNotification?: (notification: WebSocketNotification) => void
): void {
  const queryClient = useQueryClient();
  const onNotificationRef = useRef(onNotification);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    const socket = connectSocket(user.id);

    const handleNotification = (payload?: WebSocketNotification) => {
      onNotificationRef.current?.({
        title: payload?.title ?? "New notification",
        message: payload?.message,
      });
    };

    const handleAssignmentChanged = () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.scholarAssignments(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorAssignments });
    };

    const handleAnalyticsUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scholarDashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.mentorScholars });
    };

    socket.on("notification.created", handleNotification);
    socket.on("assignment.status_changed", handleAssignmentChanged);
    socket.on("analytics.course.updated", handleAnalyticsUpdated);

    return () => {
      socket.off("notification.created", handleNotification);
      socket.off("assignment.status_changed", handleAssignmentChanged);
      socket.off("analytics.course.updated", handleAnalyticsUpdated);
    };
  }, [queryClient]);
}