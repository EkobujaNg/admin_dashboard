import type { NextRequest } from "next/server";
import { handleAuthProxy } from "@/lib/auth/proxy-config";

export function proxy(request: NextRequest) {
  return handleAuthProxy(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"],
};
