import { db, success, error, requireUser, computeScholarStats } from "@/lib/api/mock-db";
import type { PeopleStatus } from "@/lib/types";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const url = new URL(request.url);
  const role = url.searchParams.get("role");

  let users = db.users.filter((u) => u.role !== "SUPER_ADMIN");
  if (role) users = users.filter((u) => u.role === role);

  if (role === "SCHOLAR") {
    return success(
      users.map((u) => {
        const stats = computeScholarStats(u.id);
        const mentorAssignment = db.mentorAssignments.find((ma) => ma.scholarId === u.id);
        const mentor = mentorAssignment
          ? db.users.find((m) => m.id === mentorAssignment.mentorId)
          : null;
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
          courseName: db.courses[0]?.name,
          mentorName: mentor?.name,
          programName: db.programs[0]?.name,
          status: "ACTIVE" as PeopleStatus,
          progress: {
            overall: stats.overall,
            assignmentPct: stats.assignmentPct,
            attendancePct: stats.attendancePct,
          },
          atRisk: stats.atRisk,
          joinedAt: "2026-01-20T10:00:00Z",
        };
      })
    );
  }

  if (role === "MENTOR") {
    return success(
      users.map((u) => {
        const scholars = db.mentorAssignments.filter((ma) => ma.mentorId === u.id);
        const courses = [...new Set(
          db.assignments
            .filter((a) => a.mentorId === u.id)
            .map((a) => a.courseId)
        )];
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl,
          title: u.title,
          status: "ACTIVE" as PeopleStatus,
          scholarCount: scholars.length,
          courseCount: courses.length,
          courses: courses.map((cid) => {
            const c = db.courses.find((cr) => cr.id === cid);
            return { id: cid, name: c?.name ?? "Unknown" };
          }),
          joinedAt: "2026-01-15T10:00:00Z",
        };
      })
    );
  }

  return success(users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
}
