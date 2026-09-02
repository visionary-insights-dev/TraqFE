import { NextRequest, NextResponse } from "next/server";
import { type UserRole } from "@/stores/types";

const REFRESH_TOKEN_COOKIE = "refresh_token";

interface RefreshTokenPayload {
  sub?: string;
  role?: UserRole;
  organizationId?: string;
  email?: string;
  name?: string;
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

export async function middleware(
  request: NextRequest,
  verify: VerifyRefreshToken = verifyRefreshToken
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
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (config.redirectAuthed && isAuthenticated && payload?.role) {
    const home = ROLE_HOME[payload.role];
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
