import nodemailer from "nodemailer";
import { getEnv } from "@/server/config/env";

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
  const useImplicitSsl = port === 465 || (encryption === "ssl" && port === 465);
  const useStartTls =
    encryption !== "none" && !useImplicitSsl && (port === 587 || encryption === "tls" || encryption === "ssl");

  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port,
    secure: useImplicitSsl,
    requireTLS: useStartTls,
    auth: {
      user: env.MAIL_USERNAME!,
      pass: env.MAIL_PASSWORD ?? "",
    },
    tls: {
      // Shared-host SMTP certs often fail strict hostname checks
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });

  transporterKey = key;
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

export function resetMailTransporter() {
  transporter = null;
  transporterKey = null;
}
