import { NextRequest, NextResponse } from "next/server";
import { type UserRole } from "@/stores/types";

const REFRESH_TOKEN_COOKIE = "refresh_token";

interface RefreshTokenPayload {
  sub?: string;
  role?: UserRole;
  organizationId?: string;
  email?: string;
  name?: string;
  profileComplete?: boolean;
}

const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin/dashboard",
  MENTOR: "/mentor/scholars",
  SCHOLAR: "/scholar/dashboard",
};

type RouteConfig = {
  roles?: ReadonlyArray<UserRole>;
  requireAuth?: boolean;
  redirectAuthed?: boolean;
};

const roleRoutes: Record<string, RouteConfig> = {
  "/scholar": { roles: ["SCHOLAR"], requireAuth: true },
  "/mentor": { roles: ["MENTOR"], requireAuth: true },
  "/admin": { roles: ["SUPER_ADMIN"], requireAuth: true },
};

const authRoutes: RouteConfig = { redirectAuthed: true };
const publicRoutes: RouteConfig = {};

function matchRoute(
  pathname: string,
  prefix: string
): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    return new TextEncoder().encode("dev-only-insecure-secret");
  }
  return new TextEncoder().encode(secret);
}

async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload | null> {
  try {
    // jose is ESM-only; a dynamic import keeps this module loadable in any
    // environment (edge, node, tests) and only pulls jose in when actually
    // verifying a token.
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export type VerifyRefreshToken = (
  token: string
) => Promise<RefreshTokenPayload | null>;

// Next.js invokes middleware as `middleware(request, event)`. The event
// (second arg) would override a verifier parameter, so the injectable logic
// lives in `routeRequest` and the edge entry point only forwards the request.
export async function middleware(
  request: NextRequest,
  // @typescript-eslint/no-unused-vars -- kept to document the Next.js
  // invocation shape (request, event); the verifier lives on routeRequest.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event?: unknown
) {
  return routeRequest(request, verifyRefreshToken);
}

export async function routeRequest(
  request: NextRequest,
  verify: VerifyRefreshToken
) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let config: RouteConfig = publicRoutes;
  for (const [prefix, routeConfig] of Object.entries(roleRoutes)) {
    if (matchRoute(pathname, prefix)) {
      config = routeConfig;
      break;
    }
  }
  if (matchRoute(pathname, "/auth")) {
    config = authRoutes;
  }

  const payload = token ? await verify(token) : null;
  const isAuthenticated = payload !== null;

  if (config.requireAuth) {
    if (!isAuthenticated || !payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const userRole = payload.role;
    if (!userRole || !config.roles?.includes(userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = userRole ? ROLE_HOME[userRole] : "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    // Force incomplete profiles to complete onboarding before accessing
    // protected role pages.
    if (payload.profileComplete === false) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/onboarding";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (config.redirectAuthed && isAuthenticated && payload?.role) {
    // Auth screens must never trap an incomplete-profile user in an onboarding
    // loop: someone holding a valid refresh cookie but without a completed
    // profile still needs to reach /auth/sign-in to sign out or switch
    // accounts. Only complete-profile users are bounced from the auth area to
    // their role home; incomplete profiles are still funneled into onboarding
    // by the requireAuth guard below when they try to reach a protected role
    // page.
    const home = ROLE_HOME[payload.role];
    if (home && payload.profileComplete !== false) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
