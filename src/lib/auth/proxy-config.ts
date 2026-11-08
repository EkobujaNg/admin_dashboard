import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, isAuthPublicRoute } from "./routes";

export const AUTHENTICATED_HOME = "/overview";

export function getSafeRedirect(path: string | null | undefined, fallback: string) {
  // Browsers treat "/\evil.com" like "//evil.com" and strip tabs/newlines, so reject
  // backslashes and control characters as well as protocol-relative paths.
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(path) ||
    isAuthPublicRoute(path)
  ) {
    return fallback;
  }
  return path;
}

export function handleAuthProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isPublic = isAuthPublicRoute(pathname);

  if (isPublic && token) {
    return NextResponse.redirect(new URL(AUTHENTICATED_HOME, request.url));
  }

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
