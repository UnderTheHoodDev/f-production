import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, isSessionTokenValid } from "@/lib/auth";

// NOTE: proxy.ts middleware only guards `/admin/*` *pages* (matcher
// "/admin/:path*"), NOT `/api/*`. Every admin API route must therefore guard
// itself with requireAdmin(), or it is world-writable.

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return isSessionTokenValid(token);
}

/**
 * Returns a 401 response if the caller is not an authenticated admin, otherwise
 * null. Usage: `const denied = await requireAdmin(); if (denied) return denied;`
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminRequest()) return null;
  return NextResponse.json(
    { success: false, message: "Không có quyền truy cập." },
    { status: 401 }
  );
}
