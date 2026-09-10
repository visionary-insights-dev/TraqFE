import { db, success, error, signToken } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return error("VALIDATION_ERROR", "Email and password are required");
  }

  const user = db.users.find(
    (u) => u.email === body.email && u.password === body.password
  );
  if (!user) {
    return error("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const accessToken = await signToken(
    {
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
      email: user.email,
      name: user.name,
      profileComplete: user.profileComplete,
    },
    "1h"
  );

  const refreshToken = await signToken(
    {
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
      email: user.email,
      name: user.name,
      profileComplete: user.profileComplete,
    },
    "7d"
  );

  const response = success({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      avatarUrl: user.avatarUrl,
      profileComplete: user.profileComplete,
    },
  });

  const res = new Response(response.body, {
    status: 200,
    headers: Object.fromEntries(response.headers),
  });

  res.headers.set(
    "Set-Cookie",
    `refresh_token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
  );

  return res;
}
