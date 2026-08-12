import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { getEnv } from "@/server/config/env";
import { ApiError } from "@/server/utils/http";

export type WhatsAppOtpPurpose = "register" | "password_reset";

export type WhatsAppOtpPayload = {
  v: 1;
  purpose: WhatsAppOtpPurpose;
  phone_e164: string;
  code_hash: string;
  exp: number;
  client_id?: string;
};

function pepper() {
  return getEnv().OTP_PEPPER || getEnv().JWT_ACCESS_SECRET;
}

function keyFromPepper() {
  return createHash("sha256").update(`solv-otp|${pepper()}`).digest();
}

export function hashOtpCode(code: string) {
  return createHash("sha256").update(`${code.trim()}|${pepper()}`).digest("hex");
}

export function encryptOtpToken(payload: WhatsAppOtpPayload) {
  const key = keyFromPepper();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const json = JSON.stringify(payload);
  const encrypted = Buffer.concat([
    cipher.update(json, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptOtpToken(token: string): WhatsAppOtpPayload {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) throw new Error("short");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const key = keyFromPepper();
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(json) as WhatsAppOtpPayload;
    if (payload.v !== 1 || !payload.purpose || !payload.phone_e164) {
      throw new Error("invalid payload");
    }
    return payload;
  } catch {
    throw new ApiError("Invalid or expired verification token", 400);
  }
}

export function assertOtpTokenValid(
  payload: WhatsAppOtpPayload,
  purpose: WhatsAppOtpPurpose,
  phoneE164: string,
) {
  if (payload.purpose !== purpose) {
    throw new ApiError("Invalid verification token", 400);
  }
  if (payload.phone_e164 !== phoneE164) {
    throw new ApiError("Phone number does not match verification", 400);
  }
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new ApiError("Verification code has expired", 400);
  }
}

export function otpExpiresInSeconds() {
  return getEnv().OTP_TTL_SECONDS;
}
