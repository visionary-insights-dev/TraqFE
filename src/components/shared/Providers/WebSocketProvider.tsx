"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Toast } from "@/components/ui";

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [notification, setNotification] = useState<{
    title?: string;
    message?: string;
  } | null>(null);

  const handleNotification = useCallback(
    (n: { title?: string; message?: string }) => setNotification(n),
    []
  );

  useWebSocket(handleNotification);

  return (
    <>
      {children}
      {notification ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 mx-auto w-full max-w-sm px-4">
          <Toast
            variant="info"
            title={notification.title}
            description={notification.message}
            onDismiss={() => setNotification(null)}
          />
        </div>
      ) : null}
    </>
  );
};