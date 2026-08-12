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
  sendPasswordResetOtpEmail,
  sendRegisterOtpEmail,
} from "@/server/mail/auth-emails";
import { consumeEmailOtp, createEmailOtp, generateOtpCode } from "@/server/mail/otp";
import {
  assertOtpTokenValid,
  decryptOtpToken,
  encryptOtpToken,
  hashOtpCode,
  otpExpiresInSeconds,
} from "@/server/otp/otp-token";
import { maskPhone, toE164 } from "@/server/otp/phone";
import { sendWhatsAppNodeOtp } from "@/server/otp/whatsapp-node";
import {
  findCountryByDialCode,
  findCountryById,
} from "@/server/services/country.service";
import {
  generateRefreshToken,
  hashToken,
} from "@/server/utils/crypto";
import { ApiError, ok } from "@/server/utils/http";
import type {
  changePasswordSchema,
  confirmEmailChangeSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  requestEmailChangeSchema,
  resendOtpSchema,
  resetPasswordSchema,
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
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

function publicClient(client: {
  id: string;
  email: string | null;
  name: string;
  phone: string | null;
  phoneVerifiedAt: Date | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: client.id,
    email: client.email,
    name: client.name,
    phone: client.phone,
    phoneVerified: Boolean(client.phoneVerifiedAt),
    emailVerified: Boolean(client.emailVerifiedAt),
    createdAt: client.createdAt.toISOString(),
  };
}

function isAccountVerified(client: {
  phoneVerifiedAt: Date | null;
  emailVerifiedAt: Date | null;
  phone: string | null;
  email: string | null;
}) {
  if (client.phone && client.phoneVerifiedAt) return true;
  if (client.email && client.emailVerifiedAt) return true;
  // Legacy email-only accounts without phone
  if (!client.phone && client.emailVerifiedAt) return true;
  return false;
}

async function issueTokenPair(client: {
  id: string;
  email: string | null;
  phone: string | null;
}) {
  const accessToken = await signAccessToken({
    clientId: client.id,
    email: client.email,
    phone: client.phone,
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

async function resolveCountryId(
  countryId: string | undefined,
  countryCode: string,
) {
  if (countryId) {
    const byId = await findCountryById(countryId);
    if (byId) return byId.id;
  }
  const byDial = await findCountryByDialCode(countryCode);
  return byDial?.id ?? null;
}

async function issueWhatsAppOtp(input: {
  phoneE164: string;
  purpose: "register" | "password_reset";
  clientId?: string;
}) {
  const code = generateOtpCode();
  const delivery = await sendWhatsAppNodeOtp({
    phoneE164: input.phoneE164,
    code,
  });
  const expiresIn = delivery.expiresIn || otpExpiresInSeconds();
  const otpToken = encryptOtpToken({
    v: 1,
    purpose: input.purpose,
    phone_e164: input.phoneE164,
    code_hash: hashOtpCode(code),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    client_id: input.clientId,
  });

  return {
    otpToken,
    channel: delivery.channel,
    expiresIn,
  };
}

export async function registerClient(input: RegisterInput) {
  const phoneE164 = toE164(input.countryCode, input.phone);
  const email = input.email?.trim().toLowerCase() || null;
  const countryId = await resolveCountryId(input.countryId, input.countryCode);

  const existingByPhone = await prisma.shopClient.findUnique({
    where: { phone: phoneE164 },
  });

  if (existingByPhone?.phoneVerifiedAt) {
    throw new ApiError("Phone number is already registered", 409);
  }

  if (email) {
    const existingByEmail = await prisma.shopClient.findUnique({
      where: { email },
    });
    if (
      existingByEmail &&
      existingByEmail.id !== existingByPhone?.id &&
      (existingByEmail.emailVerifiedAt || existingByEmail.phoneVerifiedAt)
    ) {
      throw new ApiError("Email is already registered", 409);
    }
  }

  const passwordHash = await hashPassword(input.password);

  const client = existingByPhone
    ? await prisma.shopClient.update({
        where: { id: existingByPhone.id },
        data: {
          name: input.name,
          email,
          passwordHash,
          countryId,
          phoneVerifiedAt: null,
        },
      })
    : await prisma.shopClient.create({
        data: {
          name: input.name,
          email,
          phone: phoneE164,
          countryId,
          passwordHash,
          phoneVerifiedAt: null,
          emailVerifiedAt: null,
        },
      });

  const otp = await issueWhatsAppOtp({
    phoneE164,
    purpose: "register",
    clientId: client.id,
  });

  return ok(
    {
      requiresVerification: true,
      channel: otp.channel,
      otpToken: otp.otpToken,
      expiresIn: otp.expiresIn,
      phone: phoneE164,
      phoneMasked: maskPhone(phoneE164),
      message: "We sent a verification code to your WhatsApp",
    },
    { status: 201 },
  );
}

export async function verifyRegisterOtp(input: VerifyOtpInput) {
  if (input.otpToken) {
    const phoneE164 =
      input.countryCode && input.phone
        ? toE164(input.countryCode, input.phone)
        : decryptOtpToken(input.otpToken).phone_e164;

    const payload = decryptOtpToken(input.otpToken);
    assertOtpTokenValid(payload, "register", phoneE164);

    if (payload.code_hash !== hashOtpCode(input.code)) {
      throw new ApiError("Invalid verification code", 400);
    }

    const client = await prisma.shopClient.findUnique({
      where: { phone: phoneE164 },
    });
    if (!client) {
      throw new ApiError("Account not found", 404);
    }
    if (payload.client_id && payload.client_id !== client.id) {
      throw new ApiError("Invalid verification code", 400);
    }

    const updated = await prisma.shopClient.update({
      where: { id: client.id },
      data: {
        phoneVerifiedAt: new Date(),
        ...(client.email ? { emailVerifiedAt: client.emailVerifiedAt ?? new Date() } : {}),
      },
    });

    const tokens = await issueTokenPair(updated);
    const response = ok({ client: publicClient(updated) });
    return setAuthCookies(response, tokens);
  }

  // Legacy email OTP path
  if (!input.email) {
    throw new ApiError("Email or otpToken is required", 400);
  }
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
  if (input.countryCode && input.phone) {
    const phoneE164 = toE164(input.countryCode, input.phone);
    const client = await prisma.shopClient.findUnique({
      where: { phone: phoneE164 },
    });
    if (!client) {
      throw new ApiError("Account not found", 404);
    }
    if (client.phoneVerifiedAt) {
      throw new ApiError("Phone is already verified. You can sign in.", 400);
    }

    const otp = await issueWhatsAppOtp({
      phoneE164,
      purpose: "register",
      clientId: client.id,
    });

    return ok({
      phone: phoneE164,
      phoneMasked: maskPhone(phoneE164),
      channel: otp.channel,
      otpToken: otp.otpToken,
      expiresIn: otp.expiresIn,
      message: "A new verification code was sent on WhatsApp",
    });
  }

  if (!input.email) {
    throw new ApiError("Email or phone is required", 400);
  }

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

  sendRegisterOtpEmail(email, code, client.name);

  return ok({
    email,
    message: "A new verification code was sent",
  });
}

export async function loginClient(input: LoginInput) {
  let client =
    input.email
      ? await prisma.shopClient.findUnique({
          where: { email: input.email.toLowerCase() },
        })
      : null;

  if (!client && input.countryCode && input.phone) {
    const phoneE164 = toE164(input.countryCode, input.phone);
    client = await prisma.shopClient.findUnique({
      where: { phone: phoneE164 },
    });
  }

  if (!client) {
    throw new ApiError("Invalid credentials", 401);
  }

  const valid = await verifyPassword(input.password, client.passwordHash);
  if (!valid) {
    throw new ApiError("Invalid credentials", 401);
  }

  if (!isAccountVerified(client)) {
    if (client.phone && !client.phoneVerifiedAt) {
      throw new ApiError("Please verify your phone before signing in", 403, {
        code: "PHONE_NOT_VERIFIED",
        phone: client.phone,
      });
    }

    if (client.email && !client.emailVerifiedAt) {
      const pendingOtp = await prisma.emailOtp.findFirst({
        where: {
          email: client.email,
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

      await prisma.shopClient.update({
        where: { id: client.id },
        data: { emailVerifiedAt: new Date() },
      });
      client = { ...client, emailVerifiedAt: new Date() };
    }
  }

  const tokens = await issueTokenPair(client);
  const response = ok({
    client: publicClient(client),
  });
  return setAuthCookies(response, tokens);
}

export async function forgotPassword(input: ForgotPasswordInput) {
  if (input.countryCode && input.phone) {
    const phoneE164 = toE164(input.countryCode, input.phone);
    const client = await prisma.shopClient.findUnique({
      where: { phone: phoneE164 },
    });

    // Always look successful to avoid account enumeration
    if (!client?.phoneVerifiedAt) {
      return ok({
        ok: true,
        channel: "whatsapp_node",
        message: "If an account exists, a reset code was sent on WhatsApp",
      });
    }

    const otp = await issueWhatsAppOtp({
      phoneE164,
      purpose: "password_reset",
      clientId: client.id,
    });

    return ok({
      ok: true,
      channel: otp.channel,
      otpToken: otp.otpToken,
      expiresIn: otp.expiresIn,
      phoneMasked: maskPhone(phoneE164),
      message: "If an account exists, a reset code was sent on WhatsApp",
    });
  }

  if (!input.email) {
    throw new ApiError("Email or phone is required", 400);
  }

  const email = input.email.toLowerCase();
  const client = await prisma.shopClient.findUnique({ where: { email } });

  if (!client?.email) {
    return ok({
      ok: true,
      channel: "email",
      message: "If an account exists, a reset code was sent to your email",
    });
  }

  // Prefer WhatsApp when the account has a verified phone
  if (client.phone && client.phoneVerifiedAt) {
    const otp = await issueWhatsAppOtp({
      phoneE164: client.phone,
      purpose: "password_reset",
      clientId: client.id,
    });
    return ok({
      ok: true,
      channel: otp.channel,
      otpToken: otp.otpToken,
      expiresIn: otp.expiresIn,
      phoneMasked: maskPhone(client.phone),
      message: "If an account exists, a reset code was sent on WhatsApp",
    });
  }

  const { code } = await createEmailOtp({
    email,
    purpose: "PASSWORD_RESET",
    clientId: client.id,
  });
  sendPasswordResetOtpEmail(email, code, client.name);

  return ok({
    ok: true,
    channel: "email",
    email,
    message: "If an account exists, a reset code was sent to your email",
  });
}

export async function resetPassword(input: ResetPasswordInput) {
  if (input.otpToken) {
    const phoneE164 =
      input.countryCode && input.phone
        ? toE164(input.countryCode, input.phone)
        : decryptOtpToken(input.otpToken).phone_e164;

    const payload = decryptOtpToken(input.otpToken);
    assertOtpTokenValid(payload, "password_reset", phoneE164);

    if (payload.code_hash !== hashOtpCode(input.code)) {
      throw new ApiError("Invalid verification code", 400);
    }

    const client = await prisma.shopClient.findUnique({
      where: { phone: phoneE164 },
    });
    if (!client) {
      throw new ApiError("Account not found", 404);
    }
    if (payload.client_id && payload.client_id !== client.id) {
      throw new ApiError("Invalid verification code", 400);
    }

    const passwordHash = await hashPassword(input.newPassword);
    await prisma.shopClient.update({
      where: { id: client.id },
      data: { passwordHash },
    });

    return ok({
      updated: true,
      message: "Password updated. You can sign in now.",
    });
  }

  if (!input.email) {
    throw new ApiError("Email or otpToken is required", 400);
  }

  const email = input.email.toLowerCase();
  const otp = await consumeEmailOtp({
    email,
    purpose: "PASSWORD_RESET",
    code: input.code,
  });

  const client = await prisma.shopClient.findUnique({ where: { email } });
  if (!client || (otp.clientId && otp.clientId !== client.id)) {
    throw new ApiError("Invalid verification code", 400);
  }

  const passwordHash = await hashPassword(input.newPassword);
  await prisma.shopClient.update({
    where: { id: client.id },
    data: { passwordHash },
  });

  return ok({
    updated: true,
    message: "Password updated. You can sign in now.",
  });
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

  if (!isAccountVerified(stored.client)) {
    throw new ApiError("Account not verified", 401);
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

  sendEmailChangeOtpEmail(newEmail, code, client.name);

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
