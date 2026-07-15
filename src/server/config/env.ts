import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),
  APP_URL: z.string().url().default("http://localhost:3000"),
  APP_NAME: z.string().default("Solv"),
  ADMIN_EMAIL: z.string().email().optional(),
  UPLOAD_API_URL: z
    .string()
    .url()
    .default("https://st79068.ispot.cc/solv/upload.php"),
  UPLOAD_API_TOKEN: z.string().min(1),
  UPLOAD_PUBLIC_BASE_URL: z
    .string()
    .url()
    .default("https://st79068.ispot.cc/solv"),
  MAIL_HOST: z.string().default("mail.amcserver.com"),
  MAIL_PORT: z.coerce.number().int().positive().default(587),
  MAIL_ENCRYPTION: z
    .string()
    .optional()
    .transform((v) => (v ?? "tls").toLowerCase())
    .pipe(z.enum(["ssl", "tls", "none"])),
  MAIL_USERNAME: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),
  MAIL_FROM_ADDRESS: z.string().email().optional(),
  MAIL_FROM_NAME: z.string().optional(),
  MAIL_ORDER_NOTIFY_TO: z.string().email().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

export type ServerEnv = z.infer<typeof envSchema> & {
  MAIL_FROM_NAME: string;
};

let cached: ServerEnv | null = null;

/** Reset cached env (useful after tests / hot reload of .env). */
export function resetEnvCache() {
  cached = null;
}

export function getEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${message}`);
  }

  const data = parsed.data;
  cached = {
    ...data,
    MAIL_FROM_NAME: data.MAIL_FROM_NAME || data.APP_NAME || "Solv",
  };
  return cached;
}
