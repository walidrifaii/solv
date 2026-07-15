import { prisma } from "@/lib/db";
import {
  clearAuthCookies,
  setAuthCookies,
} from "@/server/auth/cookies";
import { signAccessToken } from "@/server/auth/jwt";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { getEnv } from "@/server/config/env";
import {
  sendEmailChangeOtpEmail,
  sendRegisterOtpEmail,
} from "@/server/mail/auth-emails";
import { consumeEmailOtp, createEmailOtp } from "@/server/mail/otp";
import {
  generateRefreshToken,
  hashToken,
} from "@/server/utils/crypto";
import { ApiError, ok } from "@/server/utils/http";
import type {
  changePasswordSchema,
  confirmEmailChangeSchema,
  loginSchema,
  registerSchema,
  requestEmailChangeSchema,
  resendOtpSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
type ResendOtpInput = z.infer<typeof resendOtpSchema>;
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;
type ConfirmEmailChangeInput = z.infer<typeof confirmEmailChangeSchema>;

function publicClient(client: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: client.id,
    email: client.email,
    name: client.name,
    phone: client.phone,
    emailVerified: Boolean(client.emailVerifiedAt),
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

  if (existing?.emailVerifiedAt) {
    throw new ApiError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const client = existing
    ? await prisma.shopClient.update({
        where: { id: existing.id },
        data: {
          name: input.name,
          phone: input.phone || null,
          passwordHash,
        },
      })
    : await prisma.shopClient.create({
        data: {
          email,
          name: input.name,
          phone: input.phone || null,
          passwordHash,
          emailVerifiedAt: null,
        },
      });

  const { code } = await createEmailOtp({
    email,
    purpose: "REGISTER",
    clientId: client.id,
  });

  void sendRegisterOtpEmail(email, code, client.name).catch((error) => {
    console.error("[mail] Register OTP failed:", error);
  });

  return ok(
    {
      requiresVerification: true,
      email,
      message: "We sent a verification code to your email",
    },
    { status: 201 },
  );
}

export async function verifyRegisterOtp(input: VerifyOtpInput) {
  const email = input.email.toLowerCase();
  const otp = await consumeEmailOtp({
    email,
    purpose: "REGISTER",
    code: input.code,
  });

  const client = await prisma.shopClient.findUnique({ where: { email } });
  if (!client) {
    throw new ApiError("Account not found", 404);
  }

  if (otp.clientId && otp.clientId !== client.id) {
    throw new ApiError("Invalid verification code", 400);
  }

  const updated = await prisma.shopClient.update({
    where: { id: client.id },
    data: { emailVerifiedAt: new Date() },
  });

  const tokens = await issueTokenPair(updated);
  const response = ok({ client: publicClient(updated) });
  return setAuthCookies(response, tokens);
}

export async function resendRegisterOtp(input: ResendOtpInput) {
  const email = input.email.toLowerCase();
  const client = await prisma.shopClient.findUnique({ where: { email } });

  if (!client) {
    throw new ApiError("Account not found", 404);
  }
  if (client.emailVerifiedAt) {
    throw new ApiError("Email is already verified. You can sign in.", 400);
  }

  const { code } = await createEmailOtp({
    email,
    purpose: "REGISTER",
    clientId: client.id,
  });

  void sendRegisterOtpEmail(email, code, client.name).catch((error) => {
    console.error("[mail] Resend OTP failed:", error);
  });

  return ok({
    email,
    message: "A new verification code was sent",
  });
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

  if (!client.emailVerifiedAt) {
    const pendingOtp = await prisma.emailOtp.findFirst({
      where: {
        email,
        purpose: "REGISTER",
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingOtp) {
      throw new ApiError("Please verify your email before signing in", 403, {
        code: "EMAIL_NOT_VERIFIED",
        email: client.email,
      });
    }

    // Legacy accounts created before email OTP
    await prisma.shopClient.update({
      where: { id: client.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  const tokens = await issueTokenPair(client);
  const response = ok({
    client: publicClient({
      ...client,
      emailVerifiedAt: client.emailVerifiedAt ?? new Date(),
    }),
  });
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

  if (!stored.client.emailVerifiedAt) {
    throw new ApiError("Email not verified", 401);
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

export async function updateClientProfile(
  clientId: string,
  input: UpdateProfileInput,
) {
  const client = await prisma.shopClient.update({
    where: { id: clientId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone || null } : {}),
    },
  });
  return publicClient(client);
}

export async function changeClientPassword(
  clientId: string,
  input: ChangePasswordInput,
) {
  const client = await prisma.shopClient.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    throw new ApiError("Client not found", 404);
  }

  const valid = await verifyPassword(
    input.currentPassword,
    client.passwordHash,
  );
  if (!valid) {
    throw new ApiError("Current password is incorrect", 400);
  }

  const passwordHash = await hashPassword(input.newPassword);
  await prisma.shopClient.update({
    where: { id: clientId },
    data: { passwordHash },
  });

  return { updated: true };
}

export async function requestClientEmailChange(
  clientId: string,
  input: RequestEmailChangeInput,
) {
  const client = await prisma.shopClient.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    throw new ApiError("Client not found", 404);
  }

  const newEmail = input.email.toLowerCase();
  if (newEmail === client.email) {
    throw new ApiError("That is already your email", 400);
  }

  const taken = await prisma.shopClient.findUnique({
    where: { email: newEmail },
  });
  if (taken) {
    throw new ApiError("Email is already in use", 409);
  }

  const { code } = await createEmailOtp({
    email: newEmail,
    purpose: "EMAIL_CHANGE",
    clientId: client.id,
    payload: newEmail,
  });

  void sendEmailChangeOtpEmail(newEmail, code, client.name).catch((error) => {
    console.error("[mail] Email change OTP failed:", error);
  });

  return {
    pendingEmail: newEmail,
    message: "We sent a verification code to your new email",
  };
}

export async function confirmClientEmailChange(
  clientId: string,
  input: ConfirmEmailChangeInput,
) {
  const client = await prisma.shopClient.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    throw new ApiError("Client not found", 404);
  }

  const newEmail = input.email.toLowerCase();
  const otp = await consumeEmailOtp({
    email: newEmail,
    purpose: "EMAIL_CHANGE",
    code: input.code,
  });

  if (otp.clientId !== clientId || otp.payload !== newEmail) {
    throw new ApiError("Invalid verification code", 400);
  }

  const taken = await prisma.shopClient.findUnique({
    where: { email: newEmail },
  });
  if (taken && taken.id !== clientId) {
    throw new ApiError("Email is already in use", 409);
  }

  const updated = await prisma.shopClient.update({
    where: { id: clientId },
    data: {
      email: newEmail,
      emailVerifiedAt: new Date(),
    },
  });

  return publicClient(updated);
}
