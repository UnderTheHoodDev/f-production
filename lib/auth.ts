const SESSION_COOKIE_NAME = "fp_admin_session";
const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

type AuthConfig = {
  username: string;
  password: string;
  secret: string;
};

let cachedConfig: AuthConfig | null = null;

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function getAuthConfig(): AuthConfig {
  if (cachedConfig) return cachedConfig;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret) {
    throw new Error(
      "Missing ADMIN_USERNAME, ADMIN_PASSWORD or ADMIN_SESSION_SECRET environment variables."
    );
  }

  cachedConfig = { username, password, secret };
  return cachedConfig;
}

async function hashSessionToken(username: string) {
  const { secret } = getAuthConfig();
  const data = encoder.encode(`${secret}:${username}:fproduction-admin`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

export async function createSessionToken(username: string) {
  return hashSessionToken(username);
}

export async function isSessionTokenValid(token?: string | null) {
  if (!token) return false;
  const { username } = getAuthConfig();
  const expected = await hashSessionToken(username);
  return safeEqual(token, expected);
}

export function getAdminCredentials() {
  const { username, password } = getAuthConfig();
  return { username, password };
}

export function sanitizeAdminRedirect(path?: string | null) {
  if (!path || typeof path !== "string") {
    return "/admin/dashboard";
  }

  try {
    const decoded = decodeURIComponent(path);
    if (!decoded.startsWith("/")) {
      return "/admin/dashboard";
    }
    if (!decoded.startsWith("/admin")) {
      return "/admin/dashboard";
    }
    return decoded === "/admin" ? "/admin/dashboard" : decoded;
  } catch {
    return "/admin/dashboard";
  }
}

export const SESSION_MAX_AGE = Number(
  process.env.ADMIN_SESSION_MAX_AGE ?? DEFAULT_SESSION_MAX_AGE
);

export function getCookieSettings() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

export { SESSION_COOKIE_NAME };

