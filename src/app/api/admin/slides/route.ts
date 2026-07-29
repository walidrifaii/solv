import { NextRequest } from "next/server";
import { isAdmin } from "@/server/middleware/isAdmin";
import {
  adminCreateSlide,
  adminListSlides,
} from "@/server/services/admin-slide.service";
import {
  adminSlideListQuerySchema,
  createSlideSchema,
} from "@/server/validators/schemas";

export const GET = isAdmin(async (req: NextRequest) => {
  const query = adminSlideListQuerySchema.parse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  return adminListSlides(query);
});

export const POST = isAdmin(async (req: NextRequest) => {
  const body = createSlideSchema.parse(await req.json());
  return adminCreateSlide(body);
});
