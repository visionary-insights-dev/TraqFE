import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success({
    id: "cohort-001",
    name: "Tech Foundations 2026 Cohort",
    members: db.users
      .filter((u) => u.role === "SCHOLAR" || u.role === "MENTOR")
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role as "SCHOLAR" | "MENTOR",
        avatarUrl: u.avatarUrl,
      })),
  });
}
