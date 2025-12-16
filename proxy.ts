import { NextRequest, NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  isSessionTokenValid,
  sanitizeAdminRedirect,
} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname.startsWith("/admin/login");
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await isSessionTokenValid(token);

  if (isLoginRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url),
        307
      );
    }
    return NextResponse.next();
  }

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const redirectTo =
      pathname === "/admin"
        ? "/admin/dashboard"
        : sanitizeAdminRedirect(pathname);
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(loginUrl, 307);
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
