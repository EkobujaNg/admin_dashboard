const AUTH_PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-code",
] as const;

// Distinct from the other dashboards' auth cookies: cookies are shared across
// localhost ports, so a shared name lets one app overwrite another's session.
export const AUTH_COOKIE_NAME = "adminAuthToken";

export function isAuthPublicRoute(pathname: string): boolean {
  return AUTH_PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
