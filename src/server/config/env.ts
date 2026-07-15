import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),
  APP_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_API_URL: z
    .string()
    .url()
    .default("https://st79068.ispot.cc/solv/upload.php"),
  UPLOAD_API_TOKEN: z.string().min(1),
  UPLOAD_PUBLIC_BASE_URL: z
    .string()
    .url()
    .default("https://st79068.ispot.cc/solv"),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});


export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

export function getEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${message}`);
  }

  cached = parsed.data;
  return cached;
}
