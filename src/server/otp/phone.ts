import { getEnv } from "@/server/config/env";
import { ApiError } from "@/server/utils/http";

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** Normalize country dial + national number to E.164 (+digits). */
export function toE164(countryCode: string, phone: string) {
  const dial = digitsOnly(countryCode);
  let national = digitsOnly(phone);
  if (!dial || !national) {
    throw new ApiError("Enter a valid country code and phone number", 400);
  }
  // Drop a single leading 0 on national numbers (common trunk prefix).
  if (national.startsWith("0")) {
    national = national.slice(1);
  }
  if (national.startsWith(dial) && national.length > dial.length + 4) {
    national = national.slice(dial.length);
  }
  if (national.length < 5 || national.length > 15) {
    throw new ApiError("Enter a valid phone number", 400);
  }
  return `+${dial}${national}`;
}

export function phoneForWhatsAppNode(phoneE164: string) {
  const format = getEnv().WHATSAPP_NODE_PHONE_FORMAT;
  const digits = digitsOnly(phoneE164);
  return format === "E164" ? `+${digits}` : digits;
}

export function maskPhone(phoneE164: string) {
  const digits = digitsOnly(phoneE164);
  if (digits.length < 6) return phoneE164;
  return `+${digits.slice(0, 3)}***${digits.slice(-3)}`;
}
