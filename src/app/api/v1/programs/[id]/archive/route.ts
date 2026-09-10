import { db, success, error, requireUser, recordAuditLog } from "@/lib/api/mock-db";
import type { UserRole } from "@/stores/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const program = db.programs.find((p) => p.id === id);
  if (!program) return error("NOT_FOUND", "Program not found", 404);

  if (program.status === "ARCHIVED") {
    return error("ALREADY_ARCHIVED", "Program is already archived", 409);
  }

  program.status = "ARCHIVED";

  const author = db.users.find((u) => u.id === user.sub);
  recordAuditLog({
    entityType: "PROGRAM",
    entityId: program.id,
    entityLabel: program.name,
    eventType: "PROGRAM_ARCHIVED",
    actorName: author?.name ?? "System",
    actorRole: user.role as UserRole,
    action: "program archived",
    detail: `Program "${program.name}" archived`,
  });

  const courseCount = db.courses.filter((c) => c.programId === program.id).length;
  const scholarCount = db.users.filter((u) => u.role === "SCHOLAR").length;

  return success({ ...program, courseCount, scholarCount });
}