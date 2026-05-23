import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

const adminAccessTokens = new Map<string, number>();
const tokenTtlMs = 30 * 60 * 1000;
const adminAccessCookie = "portfolio_admin_access";

function clearExpiredTokens() {
  const now = Date.now();

  for (const [token, expiresAt] of adminAccessTokens.entries()) {
    if (expiresAt <= now) {
      adminAccessTokens.delete(token);
    }
  }
}

export function createAdminAccessToken() {
  clearExpiredTokens();

  const token = randomUUID();
  adminAccessTokens.set(token, Date.now() + tokenTtlMs);

  return token;
}

function hasAdminAccessToken(token?: string | null) {
  clearExpiredTokens();

  if (!token) {
    return false;
  }

  const expiresAt = adminAccessTokens.get(token);

  return typeof expiresAt === "number" && expiresAt > Date.now();
}

export async function setAdminAccessCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(adminAccessCookie, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: tokenTtlMs / 1000,
    path: "/admin",
  });
}

export async function clearAdminAccessCookie() {
  const cookieStore = await cookies();

  cookieStore.set(adminAccessCookie, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin",
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminAccessCookie)?.value;

  return hasAdminAccessToken(token);
}
