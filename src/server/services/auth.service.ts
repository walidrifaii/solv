import { prisma } from "@/lib/db";
import {
  clearAuthCookies,
  setAuthCookies,
} from "@/server/auth/cookies";
import { signAccessToken } from "@/server/auth/jwt";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { getEnv } from "@/server/config/env";
import {
  generateRefreshToken,
  hashToken,
} from "@/server/utils/crypto";
import { ApiError } from "@/server/utils/http";
import { ok } from "@/server/utils/http";
import type { loginSchema, registerSchema } from "@/server/validators/schemas";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

function publicClient(client: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  createdAt: Date;
}) {
  return {
    id: client.id,
    email: client.email,
    name: client.name,
    phone: client.phone,
    createdAt: client.createdAt.toISOString(),
  };
}

async function issueTokenPair(client: { id: string; email: string }) {
  const accessToken = await signAccessToken({
    clientId: client.id,
    email: client.email,
  });

  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const days = getEnv().JWT_REFRESH_EXPIRES_DAYS;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      clientId: client.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

export async function registerClient(input: RegisterInput) {
  const email = input.email.toLowerCase();
  const existing = await prisma.shopClient.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const client = await prisma.shopClient.create({
    data: {
      email,
      name: input.name,
      phone: input.phone || null,
      passwordHash,
    },
  });

  const tokens = await issueTokenPair(client);
  const response = ok(
    { client: publicClient(client) },
    { status: 201 },
  );
  return setAuthCookies(response, tokens);
}

export async function loginClient(input: LoginInput) {
  const email = input.email.toLowerCase();
  const client = await prisma.shopClient.findUnique({ where: { email } });
  if (!client) {
    throw new ApiError("Invalid email or password", 401);
  }

  const valid = await verifyPassword(input.password, client.passwordHash);
  if (!valid) {
    throw new ApiError("Invalid email or password", 401);
  }

  const tokens = await issueTokenPair(client);
  const response = ok({ client: publicClient(client) });
  return setAuthCookies(response, tokens);
}

export async function refreshSession(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { client: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ApiError("Invalid or expired refresh token", 401);
  }

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokenPair(stored.client);
  const response = ok({
    client: publicClient(stored.client),
  });
  return setAuthCookies(response, tokens);
}

export async function logoutClient(refreshToken: string | null) {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  const response = ok({ loggedOut: true });
  return clearAuthCookies(response);
}

export async function getClientProfile(clientId: string) {
  const client = await prisma.shopClient.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    throw new ApiError("Client not found", 404);
  }
  return publicClient(client);
}
