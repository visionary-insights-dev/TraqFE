import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";
import type { AssignmentStatus } from "@/lib/types";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;

  if (role === "SCHOLAR") {
    const subs = db.submissions.filter((s) => s.scholarId === user.sub);
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
            status: sub?.status ?? a.status,
            submission: sub
              ? { id: sub.id, submittedAt: sub.submittedAt }
              : undefined,
          };
        })
    );
  }

  if (role === "MENTOR") {
    const mentorAssigns = db.assignments.filter((a) => a.mentorId === user.sub);
    return success(
      mentorAssigns.map((a) => {
        const subs = db.submissions.filter((s) => s.assignmentId === a.id);
        const scholarCount = db.mentorAssignments.filter(
          (ma) => ma.mentorId === user.sub
        ).length;
        return {
          id: a.id,
          title: a.title,
          description: a.description,
          courseName: db.courses.find((c) => c.id === a.courseId)?.name,
          dueAt: a.dueAt,
          status: a.status,
          published: a.published,
          publishedAt: a.publishedAt,
          audience: a.audience,
          courseId: a.courseId,
          submissionCount: subs.length,
          submissionTotal: scholarCount,
        };
      })
    );
  }

  // Admin: all assignments with full stats
  return success(
    db.assignments.map((a) => {
      const subs = db.submissions.filter((s) => s.assignmentId === a.id);
      const totalScholars = db.users.filter((u) => u.role === "SCHOLAR").length;
      const mentor = db.users.find((u) => u.id === a.mentorId);
      const program = db.programs.find((p) => p.id === a.programId);
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        dueAt: a.dueAt,
        status: a.status,
        courseId: a.courseId,
        programId: a.programId,
        programName: program?.name,
        courseName: db.courses.find((c) => c.id === a.courseId)?.name,
        mentor: mentor ? { id: mentor.id, name: mentor.name } : null,
        published: a.published,
        publishedAt: a.publishedAt,
        audience: a.audience,
        submissionStats: {
          submitted: subs.filter((s) => s.status !== "NOT_STARTED" && s.status !== "IN_PROGRESS").length,
          verified: subs.filter((s) => s.status === "VERIFIED" || s.status === "VERIFIED_LATE").length,
          pending: subs.filter((s) => s.status === "PENDING_VERIFICATION").length,
          resubmissionRequired: subs.filter((s) => s.status === "RESUBMISSION_REQUIRED").length,
          overdue: subs.filter((s) => s.status === "VERIFIED_LATE").length,
          total: totalScholars,
        },
        editWindowMinutes: db.orgSettings.assignmentEditWindowMinutes,
      };
    })
  );
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);

  const assignment = {
    id: `asgn-${mockId()}`,
    title: body?.title ?? "Untitled Assignment",
    description: body?.description ?? "",
    courseId: body?.courseId ?? db.courses[0]?.id,
    programId: body?.programId ?? db.courses.find((c) => c.id === body?.courseId)?.programId ?? db.programs[0]?.id,
    dueAt: body?.dueAt ?? new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
    status: "NOT_STARTED" as AssignmentStatus,
    published: false,
    audience: body?.audience ?? "ALL",
    mentorId: user.role === "SUPER_ADMIN" ? (body?.mentorId ?? db.users.find((u) => u.role === "MENTOR")?.id) : user.sub as string,
    createdAt: new Date().toISOString(),
  };
  db.assignments.push(assignment);

  const mentor = db.users.find((u) => u.id === assignment.mentorId);

  return success({
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    dueAt: assignment.dueAt,
    status: assignment.status,
    courseId: assignment.courseId,
    courseName: db.courses.find((c) => c.id === assignment.courseId)?.name,
    mentor: mentor ? { id: mentor.id, name: mentor.name } : null,
    published: false,
    audience: assignment.audience,
    submissionStats: {
      submitted: 0,
      verified: 0,
      pending: 0,
      resubmissionRequired: 0,
      overdue: 0,
      total: db.users.filter((u) => u.role === "SCHOLAR").length,
    },
    editWindowMinutes: db.orgSettings.assignmentEditWindowMinutes,
  });
}
