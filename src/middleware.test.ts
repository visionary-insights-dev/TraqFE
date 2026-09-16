// src/middleware.test.ts
import { middleware, routeRequest } from "./middleware";

// Middleware is the security boundary for role-based routing. It reads the
// httpOnly traq_session cookie (set server-side by /api/auth/session),
// parses the role, and either allows the request through or redirects. We
// inject a stub session parser so the routing decisions can be exercised
// deterministically. The real `parseSession` JSON.parse's the cookie value.

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
        name === "traq_session" && cookie ? { value: cookie } : undefined,
    },
  } as unknown as Parameters<typeof routeRequest>[0];
}

// The mocked NextResponse.redirect stores the target as a URL object; extract
// its pathname. Cast via `unknown` because the real NextResponse type declares
// `url` as a string.
function redirectPath(response: unknown): string {
  return (response as unknown as { url: URL }).url.pathname;
}

describe("middleware role guards", () => {
  // Next.js calls middleware as `middleware(request, event)`; the exported
  // entry point must not crash when the second argument is a fetch event.
  it("handles the Next.js (request, event) invocation shape", async () => {
    const response = await middleware(makeRequest("/admin/dashboard"), {
      waitUntil: () => undefined,
    });
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/auth/sign-in");
  });

  // No session on a protected route must bounce the user to sign-in.
  it("redirects to sign-in when there is no session cookie on a protected route", async () => {
    const parse = jest.fn();
    const response = await routeRequest(makeRequest("/admin/dashboard"), parse);
    expect(parse).not.toHaveBeenCalled();
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/auth/sign-in");
  });

  // A malformed session cookie (parser returns null) is treated as
  // unauthenticated and bounced to sign-in.
  it("redirects to sign-in when the session cookie fails to parse", async () => {
    const parse = jest.fn().mockReturnValue(null);
    const response = await routeRequest(makeRequest("/scholar/dashboard", "bad"), parse);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/auth/sign-in");
  });

  // A valid SUPER_ADMIN session must be allowed through on /admin.
  it("allows a super admin through the admin area", async () => {
    const parse = jest.fn().mockReturnValue({ role: "SUPER_ADMIN" });
    const response = await routeRequest(makeRequest("/admin/dashboard", "sess"), parse);
    expect(parse).toHaveBeenCalledWith("sess");
    expect(response).toMatchObject({ kind: "next" });
  });

  // A SCHOLAR trying to reach /admin (role mismatch) is redirected to their
  // own dashboard.
  it("redirects a scholar away from the admin area (role mismatch)", async () => {
    const parse = jest.fn().mockReturnValue({ role: "SCHOLAR" });
    const response = await routeRequest(makeRequest("/admin/dashboard", "sess"), parse);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/scholar/dashboard");
  });

  // A MENTOR is admitted to the mentor area.
  it("allows a mentor into the mentor area", async () => {
    const parse = jest.fn().mockReturnValue({ role: "MENTOR" });
    const response = await routeRequest(makeRequest("/mentor/scholars", "sess"), parse);
    expect(response).toMatchObject({ kind: "next" });
  });

  // Already-authenticated users should not sit on the auth screens; they get
  // bounced to their role home.
  it("redirects an authenticated scholar away from /auth to their role home", async () => {
    const parse = jest.fn().mockReturnValue({ role: "SCHOLAR" });
    const response = await routeRequest(makeRequest("/auth/sign-in", "sess"), parse);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/scholar/dashboard");
  });

  // A session whose payload carries no role is treated as unauthenticated on
  // protected routes rather than being silently allowed through.
  it("redirects to the landing page when the session payload is missing a role", async () => {
    const parse = jest.fn().mockReturnValue({});
    const response = await routeRequest(makeRequest("/scholar/dashboard", "sess"), parse);
    expect(response).toMatchObject({ kind: "redirect" });
    expect(redirectPath(response)).toBe("/");
  });

  // Public routes are reachable without a session.
  it("allows public routes through without a session", async () => {
    const response = await routeRequest(makeRequest("/"), jest.fn());
    expect(response).toMatchObject({ kind: "next" });
  });

  // The root is always the public landing page.
  it("serves the public landing page at / for a session", async () => {
    const parse = jest.fn().mockReturnValue({ role: "SCHOLAR" });
    const response = await routeRequest(makeRequest("/"), parse);
    expect(response).toMatchObject({ kind: "next" });
  });
});
