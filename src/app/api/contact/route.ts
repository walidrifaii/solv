import { NextRequest } from "next/server";
import { publicRoute } from "@/server/middleware";
import { submitContactForm } from "@/server/services/contact.service";
import { contactSchema } from "@/server/validators/schemas";

export const POST = publicRoute(async (req: NextRequest) => {
  const body = contactSchema.parse(await req.json());
  return submitContactForm(body);
});
