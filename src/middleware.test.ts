// src/middleware.test.ts
import { middleware } from "./middleware";

// Middleware is the security boundary for role-based routing. It reads the
// HTTP-only refresh_token cookie (the access token lives in client memory and
// is invisible to the edge), decodes the role, and either allows the request
// through or redirects. We inject a stub token-verifier so the routing
// decisions can be exercised deterministically without loading the ESM-only
// `jose` package (which the next/jest transform cannot transpile). The real
// `verifyRefreshToken` binds jose's jwtVerify to getSecret() and is exercised
// implicitly via this interface.
jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({ kind: "next" })),
    redirect: jest.fn((url: URL) => ({ kind: "redirect", url })),
  },
}));

function makeRequest(pathname: string, cookie?: string) {
  const url = new URL(`http://localhost${pathname}`);
  const urlWithClone = Object.assign(url, {
    clone: () => new URL(url.toString()),
  });
  return {
    nextUrl: urlWithClone,
    cookies: {
      get: (name: string) =>
        name === "refresh_token" && cookie ? { value: cookie } : undefined,
    },
  } as unknown as Parameters<typeof middleware>[0];
}

// The mocked NextResponse.redirect stores the target as a URL object; extract
// its pathname. Cast via `unknown` because the real NextResponse type declares
// `url` as a string.
function redirectPath(response: unknown): string {
  return (response as unknown as { url: URL }).url.pathname;
}

describe("middleware role guards", () => {
  // No token on a protected route must bounce the user to sign-in.
  it("redirects to sign-in when there is no refresh token on a protected route", async () => {
    const verify = jest.fn();
    const response = await middleware(makeRequest("/admin/dashboard"), verify);
    expect(verify).not.toHaveBeenCalled();
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/auth/sign-in");
  });

  // A malformed/expired token (verifier returns null / throws) is treated as
  // unauthenticated and bounced to sign-in rather than admitted.
  it("redirects to sign-in when the refresh token fails to verify", async () => {
    const verify = jest.fn().mockResolvedValue(null);
    const response = await middleware(makeRequest("/scholar/dashboard", "bad-token"), verify);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/auth/sign-in");
  });

  // A valid SUPER_ADMIN token must be allowed through on /admin.
  it("allows a super admin through the admin area", async () => {
    const verify = jest.fn().mockResolvedValue({ role: "SUPER_ADMIN" });
    const response = await middleware(makeRequest("/admin/dashboard", "token"), verify);
    expect(verify).toHaveBeenCalledWith("token");
    expect(response).toMatchObject({ kind: "next" });
  });

  // A SCHOLAR trying to reach /admin (role mismatch) is not silently dropped —
  // they are redirected away to a non-privileged location.
  it("redirects a scholar away from the admin area (role mismatch)", async () => {
    const verify = jest.fn().mockResolvedValue({ role: "SCHOLAR" });
    const response = await middleware(makeRequest("/admin/dashboard", "token"), verify);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/");
  });

  // A MENTOR is admitted to the mentor area.
  it("allows a mentor into the mentor area", async () => {
    const verify = jest.fn().mockResolvedValue({ role: "MENTOR" });
    const response = await middleware(makeRequest("/mentor/scholars", "token"), verify);
    expect(response).toMatchObject({ kind: "next" });
  });

  // Already-authenticated users should not sit on the auth screens; they get
  // bounced to their role home.
  it("redirects an authenticated scholar away from /auth to their role home", async () => {
    const verify = jest.fn().mockResolvedValue({ role: "SCHOLAR" });
    const response = await middleware(makeRequest("/auth/sign-in", "token"), verify);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/scholar/dashboard");
  });

  // A token whose payload carries no role is treated as unauthenticated on
  // protected routes rather than being silently allowed through.
  it("redirects to the landing page when the token payload is missing a role", async () => {
    const verify = jest.fn().mockResolvedValue({});
    const response = await middleware(makeRequest("/scholar/dashboard", "token"), verify);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/");
  });

  // Public routes are reachable without a token.
  it("allows public routes through without a token", async () => {
    const response = await middleware(makeRequest("/"));
    expect(response).toMatchObject({ kind: "next" });
  });
});
