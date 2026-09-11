import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "25", 10);
  const entityType = url.searchParams.get("entityType");
  const actor = url.searchParams.get("actor");
  const eventType = url.searchParams.get("eventType");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let logs = [...db.auditLogs].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  if (entityType) {
    const normalized = entityType.toUpperCase();
    logs = logs.filter((l) => l.entityType.toUpperCase() === normalized);
  }
  if (actor) logs = logs.filter((l) => l.actorName?.toLowerCase().includes(actor.toLowerCase()));
  if (eventType) logs = logs.filter((l) => l.eventType === eventType);
  if (from) logs = logs.filter((l) => l.at >= from);
  if (to) logs = logs.filter((l) => l.at <= to);

  const total = logs.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = logs.slice(start, start + limit);

  return success(data, { page, limit, total, totalPages });
}
