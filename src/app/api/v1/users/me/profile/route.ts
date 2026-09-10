import { db, success, error, requireUser } from "@/lib/api/mock-db";

export async function GET(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const dbUser = db.users.find((u) => u.id === user.sub);
  if (!dbUser) return error("NOT_FOUND", "User not found", 404);

  return success({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    avatarUrl: dbUser.avatarUrl,
    role: dbUser.role,
    profileComplete: dbUser.profileComplete,
  });
}

export async function PATCH(request: Request) {
  const user = await requireUser(request);
  if (!user) return error("UNAUTHORIZED", "Authentication required", 401);

  const body = await request.json().catch(() => null);
  if (!body) return error("VALIDATION_ERROR", "Request body is required");

  const dbUser = db.users.find((u) => u.id === user.sub);
  if (!dbUser) return error("NOT_FOUND", "User not found", 404);

  if (body.name !== undefined) dbUser.name = body.name;
  if (body.phone !== undefined) dbUser.phone = body.phone;
  if (body.avatarUrl !== undefined) dbUser.avatarUrl = body.avatarUrl;
  if (body.title !== undefined) dbUser.title = body.title;
  dbUser.profileComplete = true;

  return success({
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    avatarUrl: dbUser.avatarUrl,
    role: dbUser.role,
    profileComplete: dbUser.profileComplete,
  });
}
