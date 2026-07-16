import { sendContactFormEmail } from "@/server/mail/contact-emails";
import { ApiError, ok } from "@/server/utils/http";
import type { contactSchema } from "@/server/validators/schemas";
import type { z } from "zod";

type ContactInput = z.infer<typeof contactSchema>;

export async function submitContactForm(input: ContactInput) {
  const result = sendContactFormEmail({
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    subject: input.subject,
    message: input.message,
  });

  if (!result.queued) {
    throw new ApiError(
      "Email is not configured. Please try again later or call us directly.",
      503,
    );
  }

  return ok({
    sent: true,
    message: "Your message has been sent",
  });
}
