import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  getAdminCredentials,
  getCookieSettings,
  sanitizeAdminRedirect,
} from "@/lib/auth";

export async function POST(request: Request) {
  let payload: { username?: string; password?: string; redirectTo?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Payload không hợp lệ." },
      { status: 400 }
    );
  }

  const { username, password } = payload;
  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: "Vui lòng nhập tên đăng nhập và mật khẩu." },
      { status: 400 }
    );
  }

  const admin = getAdminCredentials();

  if (username !== admin.username || password !== admin.password) {
    return NextResponse.json(
      { success: false, message: "Tài khoản hoặc mật khẩu không chính xác." },
      { status: 401 }
    );
  }

  const sessionToken = await createSessionToken(admin.username);
  const redirectTo = sanitizeAdminRedirect(payload.redirectTo);

  const response = NextResponse.json({
    success: true,
    redirectTo,
  });

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, getCookieSettings());

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...getCookieSettings(),
    maxAge: 0,
  });
  return response;
}

