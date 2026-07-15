import { sendMail } from "@/server/mail/mailer";
import { getEnv } from "@/server/config/env";

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

export async function sendRegisterOtpEmail(to: string, code: string, name: string) {
  const subject = "Your verification code";
  const html = layout(
    "Verify your email",
    `
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#7a6b5d;">
        Hi ${escapeHtml(name)}, use this code to open your account.
      </p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:32px;letter-spacing:0.2em;font-weight:700;color:#17100a;">
        ${escapeHtml(code)}
      </p>
      <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6b5d;">
        This code expires in 10 minutes. If you did not create an account, ignore this email.
      </p>
    `,
  );
  await sendMail({ to, subject, html, text: `Your code is ${code}` });
}

export async function sendEmailChangeOtpEmail(
  to: string,
  code: string,
  name: string,
) {
  const subject = "Confirm your new email";
  const html = layout(
    "Confirm email change",
    `
      <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#7a6b5d;">
        Hi ${escapeHtml(name)}, use this code to confirm your new email address.
      </p>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:32px;letter-spacing:0.2em;font-weight:700;color:#17100a;">
        ${escapeHtml(code)}
      </p>
      <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#7a6b5d;">
        This code expires in 10 minutes.
      </p>
    `,
  );
  await sendMail({ to, subject, html, text: `Your code is ${code}` });
}
