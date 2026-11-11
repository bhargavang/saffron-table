import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/admin-session";

/**
 * Sends signed-out visitors from /admin to the sign-in page, and signed-in
 * staff from the sign-in page to /admin. The admin page and every admin
 * Server Action check the session again themselves.
 */
export function proxy(request: NextRequest) {
  const loggedIn = isValidSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  const onLogin = request.nextUrl.pathname === "/admin/login";

  if (onLogin && loggedIn) return NextResponse.redirect(new URL("/admin", request.url));
  if (!onLogin && !loggedIn) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
