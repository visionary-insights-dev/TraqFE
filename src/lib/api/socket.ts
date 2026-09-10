import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "@/stores/auth";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(WS_URL, {
    autoConnect: false,
    transports: ["websocket"],
    auth: (cb) => cb({ token: getAccessToken() }),
  });
  return socket;
}

export function connectSocket(userId: string): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: getAccessToken() };
    s.connect();
    s.emit("join", { room: `user:${userId}` });
  }
  return s;
}

/** Joins the admin's personal room and the org-wide admins room. */
export function connectAdminSocket(userId: string, orgId: string): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token: getAccessToken() };
    s.connect();
    s.emit("join", { room: `user:${userId}` });
    s.emit("join", { room: `organization:${orgId}:admins` });
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) socket.disconnect();
}
