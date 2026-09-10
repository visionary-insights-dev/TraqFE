import { db, success, error, verifyToken, signToken } from "@/lib/api/mock-db";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/refresh_token=([^;]+)/);
  if (!match) {
    return error("NO_REFRESH_TOKEN", "No refresh token provided", 401);
  }

  const payload = await verifyToken(match[1]);
  if (!payload?.sub) {
    return error("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token", 401);
  }

  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) {
    return error("USER_NOT_FOUND", "User not found", 401);
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

  // Re-issue the httpOnly refresh cookie with the user's current claims (e.g.
  // profileComplete flips to true after onboarding) — the middleware reads
  // profileComplete from this cookie, so a stale claim would bounce every
  // protected route back to /auth/onboarding.
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

  const response = success({ accessToken });
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
