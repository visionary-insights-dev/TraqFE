import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const conversations = db.conversations.filter(
    (c) => c.scholarId === user.sub || c.mentorId === user.sub
  );

  return success(
    conversations.map((c) => ({
      id: c.id,
      name: c.name,
      avatarUrl: c.avatarUrl,
      lastMessage: c.lastMessage,
      unreadCount: c.unreadCount,
    }))
  );
}
