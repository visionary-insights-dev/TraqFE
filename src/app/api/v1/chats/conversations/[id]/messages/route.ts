import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const messages = db.messages.filter((m) => m.conversationId === id);

  return success(messages);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.text) {
    return error("VALIDATION_ERROR", "Text is required");
  }

  const sender = db.users.find((u) => u.id === user.sub);
  const msg = {
    id: `msg-${mockId()}`,
    conversationId: id,
    senderId: user.sub as string,
    senderName: sender?.name ?? "Unknown",
    text: body.text,
    sentAt: new Date().toISOString(),
  };
  db.messages.push(msg);

  return success(msg);
}
