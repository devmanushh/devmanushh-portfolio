import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const tokenTtlMs = 30 * 60 * 1000;
const adminAccessCookie = "portfolio_admin_access";

function getSigningSecret() {
  return (
    process.env.NEXTAUTH_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "portfolio-admin-development-secret"
  );
}

function signToken(payload: string) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
}

export function createAdminAccessToken() {
  const expiresAt = Date.now() + tokenTtlMs;
  const payload = `${expiresAt}.${randomUUID()}`;
  const signature = signToken(payload);

  return `${payload}.${signature}`;
}

function hasAdminAccessToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [expiresAtValue, nonce, signature] = parts;
  const expiresAt = Number(expiresAtValue);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const expectedSignature = signToken(`${expiresAtValue}.${nonce}`);
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
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
