import nodemailer from "nodemailer";
import { after } from "next/server";
import { getEnv } from "@/server/config/env";

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

let transporter: nodemailer.Transporter | null = null;
let transporterKey: string | null = null;

function mailEnabled() {
  const env = getEnv();
  return Boolean(env.MAIL_HOST && env.MAIL_USERNAME && env.MAIL_PASSWORD);
}

function getTransporter() {
  if (!mailEnabled()) return null;

  const env = getEnv();
  const key = [
    env.MAIL_HOST,
    env.MAIL_PORT,
    env.MAIL_ENCRYPTION,
    env.MAIL_USERNAME,
  ].join("|");

  if (transporter && transporterKey === key) return transporter;

  const encryption = env.MAIL_ENCRYPTION;
  const port = env.MAIL_PORT;

  // Port 465 = implicit SSL. Port 587 = STARTTLS (even if hosting labels it "ssl").
  const useImplicitSsl = port === 465;
  const useStartTls =
    encryption !== "none" &&
    !useImplicitSsl &&
    (port === 587 || encryption === "tls" || encryption === "ssl");

  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port,
    secure: useImplicitSsl,
    requireTLS: useStartTls,
    // Reuse SMTP connections across requests in the same process
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 5,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 15_000,
    auth: {
      user: env.MAIL_USERNAME!,
      // Gmail app passwords are often pasted with spaces
      pass: (env.MAIL_PASSWORD ?? "").replace(/\s+/g, ""),
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });

  transporterKey = key;
  return transporter;
}

/** Delivers immediately (SMTP). Prefer `queueMail` from API handlers. */
export async function sendMailNow(options: MailPayload) {
  const env = getEnv();
  const transport = getTransporter();
  if (!transport) {
    console.warn("[mail] Skipped (MAIL_* not configured):", options.subject);
    return { skipped: true as const };
  }

  const fromAddress = env.MAIL_FROM_ADDRESS || env.MAIL_USERNAME;
  const from = `"${env.MAIL_FROM_NAME}" <${fromAddress}>`;

  try {
    await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });
    console.info("[mail] Sent:", options.subject, "→", options.to);
    return { skipped: false as const };
  } catch (error) {
    console.error("[mail] Failed to send:", options.subject, error);
    return { skipped: false as const, error };
  }
}

/**
 * Schedules mail after the HTTP response is sent so APIs stay fast.
 * Falls back to a deferred send if outside a request context.
 */
export function queueMail(options: MailPayload) {
  const run = () => {
    void sendMailNow(options).catch((error) => {
      console.error("[mail] Background send failed:", options.subject, error);
    });
  };

  try {
    after(run);
  } catch {
    // Outside Next.js request scope (scripts/tests)
    setImmediate(run);
  }
}

/** @deprecated Use queueMail — kept as alias for fire-and-forget sends */
export async function sendMail(options: MailPayload) {
  queueMail(options);
  return { skipped: false as const, queued: true as const };
}

export function getOrderNotifyAdminEmail() {
  const env = getEnv();
  return env.MAIL_ORDER_NOTIFY_TO || env.ADMIN_EMAIL || env.MAIL_USERNAME;
}

export function getContactNotifyEmail() {
  const env = getEnv();
  return (
    env.MAIL_CONTACT_TO ||
    env.MAIL_ORDER_NOTIFY_TO ||
    env.MAIL_FROM_ADDRESS ||
    env.MAIL_USERNAME ||
    env.ADMIN_EMAIL
  );
}

export function resetMailTransporter() {
  if (transporter) {
    try {
      transporter.close();
    } catch {
      // ignore close errors on hot reload
    }
  }
  transporter = null;
  transporterKey = null;
}
