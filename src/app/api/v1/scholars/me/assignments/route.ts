import { db, success, error, requireUser, getScholarTaskStatus } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const subs = db.submissions.filter((s) => s.scholarId === user.sub);
  const scholarId = user.sub as string;

  return success(
    db.assignments
      .filter((a) => a.published)
      .map((a) => {
        const sub = subs.find((s) => s.assignmentId === a.id);
        return {
          id: a.id,
          title: a.title,
          description: a.description,
          courseName: db.courses.find((c) => c.id === a.courseId)?.name,
          dueAt: a.dueAt,
          status: getScholarTaskStatus(scholarId, a.id, sub?.status ?? a.status),
          submission: sub
            ? { id: sub.id, submittedAt: sub.submittedAt }
            : undefined,
        };
      })
  );
}
