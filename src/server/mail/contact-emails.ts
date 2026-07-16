import { getEnv } from "@/server/config/env";
import {
  getContactNotifyEmail,
  sendMailNow,
} from "@/server/mail/mailer";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(title: string, body: string) {
  const brand = getEnv().APP_NAME || "Solv";
  return `<!doctype html>
<html>
  <body style="margin:0;background:#FEF9F6;font-family:Georgia,serif;color:#2a1f16;">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border:1px solid #e8ddd2;border-radius:16px;overflow:hidden;">
      <div style="background:#17100a;padding:20px 24px;">
        <p style="margin:0;color:#c4a574;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">${escapeHtml(brand)}</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:500;">${title}</h1>
      </div>
      <div style="padding:24px;">${body}</div>
    </div>
  </body>
</html>`;
}

export async function sendContactFormEmail(input: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  const to = getContactNotifyEmail();
  if (!to) {
    console.warn("[mail] No notify address configured for contact form");
    return { ok: false as const, reason: "missing_to" as const };
  }

  const subject = `Contact: ${input.subject}`;
  const phone = input.phone?.trim() || "—";
  const html = layout(
    "New contact message",
    `
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#7a6b5d;">
        Someone sent a message from the Solv contact form.
      </p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;"><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;"><strong>Message:</strong></p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;line-height:1.6;color:#2a1f16;">${escapeHtml(input.message)}</p>
    `,
  );

  const result = await sendMailNow({
    to,
    subject,
    html,
    text: `From: ${input.name} <${input.email}>\nPhone: ${phone}\nSubject: ${input.subject}\n\n${input.message}`,
    replyTo: input.email,
  });

  if (result.skipped) {
    return { ok: false as const, reason: "mail_not_configured" as const };
  }
  if ("error" in result && result.error) {
    return { ok: false as const, reason: "send_failed" as const };
  }

  return { ok: true as const, to };
}
