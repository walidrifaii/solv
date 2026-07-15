import { prisma } from "@/lib/db";
import {
  clearAdminAuthCookies,
  setAdminAuthCookies,
} from "@/server/auth/cookies";
import { signAdminAccessToken } from "@/server/auth/jwt";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { getEnv } from "@/server/config/env";
import {
  generateRefreshToken,
  hashToken,
} from "@/server/utils/crypto";
import { ApiError, ok } from "@/server/utils/http";
import type { loginSchema } from "@/server/validators/schemas";
import type { z } from "zod";

type LoginInput = z.infer<typeof loginSchema>;

function publicAdmin(admin: {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    isActive: admin.isActive,
    createdAt: admin.createdAt.toISOString(),
  };
}

async function issueAdminTokenPair(admin: { id: string; email: string }) {
  const accessToken = await signAdminAccessToken({
    adminId: admin.id,
    email: admin.email,
  });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const days = getEnv().JWT_REFRESH_EXPIRES_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.adminRefreshToken.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

export async function loginAdmin(input: LoginInput) {
  const email = input.email.toLowerCase();
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !admin.isActive) {
    throw new ApiError("Invalid email or password", 401);
  }

  const valid = await verifyPassword(input.password, admin.passwordHash);
  if (!valid) {
    throw new ApiError("Invalid email or password", 401);
  }

  const tokens = await issueAdminTokenPair(admin);
  const response = ok({ admin: publicAdmin(admin) });
  return setAdminAuthCookies(response, tokens);
}

export async function refreshAdminSession(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.adminRefreshToken.findUnique({
    where: { tokenHash },
    include: { admin: true },
  });

  if (
    !stored ||
    stored.revokedAt ||
    stored.expiresAt < new Date() ||
    !stored.admin.isActive
  ) {
    throw new ApiError("Invalid or expired admin refresh token", 401);
  }

  await prisma.adminRefreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueAdminTokenPair(stored.admin);
  const response = ok({ admin: publicAdmin(stored.admin) });
  return setAdminAuthCookies(response, tokens);
}

export async function logoutAdmin(refreshToken: string | null) {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.adminRefreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  const response = ok({ loggedOut: true });
  return clearAdminAuthCookies(response);
}

export async function getAdminProfile(adminId: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin || !admin.isActive) {
    throw new ApiError("Admin not found", 404);
  }
  return publicAdmin(admin);
}

/** Used by seed / bootstrap scripts */
export async function ensureAdmin(input: {
  email: string;
  password: string;
  name: string;
}) {
  const email = input.email.toLowerCase();
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return existing;

  const passwordHash = await hashPassword(input.password);
  return prisma.admin.create({
    data: {
      email,
      name: input.name,
      passwordHash,
      isActive: true,
    },
  });
}
