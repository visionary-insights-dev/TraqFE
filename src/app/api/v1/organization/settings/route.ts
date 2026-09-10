import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  return success(db.orgSettings);
}

export async function PATCH(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body) return error("VALIDATION_ERROR", "Request body is required");

  const s = db.orgSettings;
  if (body.assignmentWeight !== undefined) s.assignmentWeight = body.assignmentWeight;
  if (body.attendanceWeight !== undefined) s.attendanceWeight = body.attendanceWeight;
  if (body.atRisk !== undefined) s.atRisk = body.atRisk;
  if (body.lateSubmissionPenaltyPct !== undefined) s.lateSubmissionPenaltyPct = body.lateSubmissionPenaltyPct;
  if (body.assignmentEditWindowMinutes !== undefined) s.assignmentEditWindowMinutes = body.assignmentEditWindowMinutes;
  if (body.attendance !== undefined) s.attendance = body.attendance;

  return success(db.orgSettings);
}
