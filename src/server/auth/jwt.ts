import { SignJWT, jwtVerify } from "jose";
import { getEnv } from "@/server/config/env";
import { parseExpiresToSeconds } from "@/server/utils/crypto";

function accessSecret() {
  return new TextEncoder().encode(getEnv().JWT_ACCESS_SECRET);
}

export async function signAccessToken(payload: {
  clientId: string;
  email: string;
}) {
  const env = getEnv();
  const expiresIn = parseExpiresToSeconds(env.JWT_ACCESS_EXPIRES);

  return new SignJWT({
    email: payload.email,
    typ: "access",
    role: "client",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.clientId)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(accessSecret());
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, accessSecret());
    if (payload.typ !== "access" || typeof payload.sub !== "string") {
      return null;
    }
    if (typeof payload.email !== "string") return null;

    return {
      id: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function signAdminAccessToken(payload: {
  adminId: string;
  email: string;
}) {
  const env = getEnv();
  const expiresIn = parseExpiresToSeconds(env.JWT_ACCESS_EXPIRES);

  return new SignJWT({
    email: payload.email,
    typ: "admin_access",
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(accessSecret());
}

export async function verifyAdminAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, accessSecret());
    if (payload.typ !== "admin_access" || payload.role !== "admin") {
      return null;
    }
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export function getAccessMaxAgeSeconds() {
  return parseExpiresToSeconds(getEnv().JWT_ACCESS_EXPIRES);
}

export function getRefreshMaxAgeSeconds() {
  return getEnv().JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60;
}
