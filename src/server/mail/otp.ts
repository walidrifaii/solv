import type { OtpPurpose } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { hashToken } from "@/server/utils/crypto";
import { ApiError } from "@/server/utils/http";
import { randomInt } from "crypto";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export async function createEmailOtp(input: {
  email: string;
  purpose: OtpPurpose;
  clientId?: string | null;
  payload?: string | null;
}) {
  const email = input.email.toLowerCase();

  const recent = await prisma.emailOtp.findFirst({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
      createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_MS) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    const waitSec = Math.ceil(
      (RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime())) / 1000,
    );
    throw new ApiError(
      `Please wait ${waitSec}s before requesting another code`,
      429,
    );
  }

  await prisma.emailOtp.updateMany({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
    },
    data: { consumedAt: new Date() },
  });

  const code = generateOtpCode();
  const row = await prisma.emailOtp.create({
    data: {
      email,
      purpose: input.purpose,
      clientId: input.clientId ?? null,
      payload: input.payload ?? null,
      codeHash: hashToken(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  return { code, otpId: row.id, expiresAt: row.expiresAt };
}

export async function consumeEmailOtp(input: {
  email: string;
  purpose: OtpPurpose;
  code: string;
}) {
  const email = input.email.toLowerCase();
  const otp = await prisma.emailOtp.findFirst({
    where: {
      email,
      purpose: input.purpose,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    throw new ApiError("Invalid or expired verification code", 400);
  }

  if (otp.expiresAt < new Date()) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    throw new ApiError("Verification code has expired", 400);
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    throw new ApiError("Too many invalid attempts. Request a new code.", 400);
  }

  const valid = otp.codeHash === hashToken(input.code.trim());
  if (!valid) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    throw new ApiError("Invalid verification code", 400);
  }

  await prisma.emailOtp.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });

  return otp;
}
