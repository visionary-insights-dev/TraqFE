import { db, success, error, requireUser, mockId } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const role = user.role as string;

  if (role === "MENTOR") {
    return success(
      db.resources.filter((r) => r.uploadedBy === user.sub)
    );
  }

  return success(db.resources);
}

export async function POST(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.type) {
    return error("VALIDATION_ERROR", "Name and type are required");
  }

  const resource = {
    id: `res-${mockId()}`,
    name: body.name,
    type: body.type,
    courseId: body.courseId,
    uploadedAt: new Date().toISOString(),
    url: body.url ?? `https://storage.scholarlink.dev/resources/${body.name}`,
    uploadedBy: user.sub as string,
  };
  db.resources.push(resource);

  return success(resource);
}
