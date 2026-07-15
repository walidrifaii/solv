import { createHash, randomBytes } from "crypto";

export function toNumber(
  value: { toString(): string } | number | null | undefined,
) {
  if (value == null) return null;
  return typeof value === "number" ? value : Number(value);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRefreshToken() {
  return randomBytes(48).toString("base64url");
}

export function parseExpiresToSeconds(value: string): number {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) return 15 * 60;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const map: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return amount * (map[unit] ?? 60);
}
