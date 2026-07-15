import nodemailer from "nodemailer";
import { getEnv } from "@/server/config/env";

let transporter: nodemailer.Transporter | null = null;

function mailEnabled() {
  const env = getEnv();
  return Boolean(env.MAIL_HOST && env.MAIL_USERNAME && env.MAIL_PASSWORD);
}

function getTransporter() {
  if (!mailEnabled()) return null;
  if (transporter) return transporter;

  const env = getEnv();
  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_PORT === 465,
    auth: {
      user: env.MAIL_USERNAME!,
      pass: (env.MAIL_PASSWORD ?? "").replace(/\s+/g, ""),
    },
  });

  return transporter;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
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
    });
    return { skipped: false as const };
  } catch (error) {
    console.error("[mail] Failed to send:", options.subject, error);
    return { skipped: false as const, error };
  }
}

export function getOrderNotifyAdminEmail() {
  const env = getEnv();
  return env.MAIL_ORDER_NOTIFY_TO || env.ADMIN_EMAIL || env.MAIL_USERNAME;
}
