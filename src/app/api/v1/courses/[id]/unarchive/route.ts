import { db, success, error, requireUser, recordAuditLog } from "@/lib/api/mock-db";
import type { UserRole } from "@/stores/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const { id } = await params;
  const idx = db.courses.findIndex((c) => c.id === id);
  if (idx < 0) return error("NOT_FOUND", "Course not found", 404);

  const course = db.courses[idx];
  if (!course.archived) {
    return error("ALREADY_ACTIVE", "Course is already active", 409);
  }

  course.archived = false;

  const author = db.users.find((u) => u.id === user.sub);
  recordAuditLog({
    entityType: "COURSE",
    entityId: course.id,
    entityLabel: course.name,
    eventType: "COURSE_ARCHIVED",
    actorName: author?.name ?? "System",
    actorRole: user.role as UserRole,
    action: "course unarchived",
    detail: `Course "${course.name}" reactivated`,
  });

  const program = course.programId ? db.programs.find((p) => p.id === course.programId) : null;

  return success({
    ...course,
    program: program ? { id: program.id, name: program.name } : null,
    scholarCount: db.users.filter((u) => u.role === "SCHOLAR").length,
    mentorName: undefined,
  });
}