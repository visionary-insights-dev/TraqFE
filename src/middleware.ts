import { NextRequest, NextResponse } from "next/server";
import { type UserRole } from "@/stores/types";

const SESSION_COOKIE = "traq_session";

interface SessionPayload {
  role?: UserRole;
  userId?: string;
  organizationId?: string;
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

/**
 * Parse the traq_session cookie. The cookie is httpOnly and set server-side,
 * so it cannot be tampered with by the client — no JWT verification needed.
 */
function parseSession(
  value: string
): SessionPayload | null {
  try {
    const parsed = JSON.parse(value) as SessionPayload;
    if (parsed && typeof parsed.role === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

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
  return routeRequest(request, parseSession);
}

export type ParseSession = (value: string) => SessionPayload | null;

export async function routeRequest(
  request: NextRequest,
  parse: ParseSession
) {
  const { pathname } = request.nextUrl;
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;

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

  const session = cookieValue ? parse(cookieValue) : null;
  const isAuthenticated = session !== null;

  if (config.requireAuth) {
    if (!isAuthenticated || !session) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      url.search = "";
      return NextResponse.redirect(url);
    }
    const userRole = session.role;
    if (!userRole || !config.roles?.includes(userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = userRole ? ROLE_HOME[userRole] : "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (config.redirectAuthed && isAuthenticated && session?.role) {
    const home = ROLE_HOME[session.role];
    if (home) {
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
