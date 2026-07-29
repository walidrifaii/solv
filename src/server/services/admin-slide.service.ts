import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { ApiError, ok } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";
import type {
  adminSlideListQuerySchema,
  createSlideSchema,
  updateSlideSchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminSlideListQuerySchema>;
type CreateInput = z.infer<typeof createSlideSchema>;
type UpdateInput = z.infer<typeof updateSlideSchema>;

function mapAdminSlide(slide: {
  id: string;
  eyebrow: string;
  eyebrowAr: string | null;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  ctaLabel: string;
  ctaLabelAr: string | null;
  imageAlt: string;
  imageAltAr: string | null;
  imagePath: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: slide.id,
    eyebrow: slide.eyebrow,
    eyebrowAr: slide.eyebrowAr,
    title: slide.title,
    titleAr: slide.titleAr,
    description: slide.description,
    descriptionAr: slide.descriptionAr,
    ctaLabel: slide.ctaLabel,
    ctaLabelAr: slide.ctaLabelAr,
    imageAlt: slide.imageAlt,
    imageAltAr: slide.imageAltAr,
    imagePath: slide.imagePath,
    href: slide.href,
    sortOrder: slide.sortOrder,
    isActive: slide.isActive,
    createdAt: slide.createdAt.toISOString(),
    updatedAt: slide.updatedAt.toISOString(),
  };
}

export async function adminListSlides(query: ListQuery) {
  const where: Prisma.HeroSlideWhereInput = {
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search } },
            { titleAr: { contains: query.search } },
            { eyebrow: { contains: query.search } },
            { eyebrowAr: { contains: query.search } },
            { description: { contains: query.search } },
            { descriptionAr: { contains: query.search } },
          ],
        }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.heroSlide.count({ where }),
    prisma.heroSlide.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip,
      take,
    }),
  ]);

  return ok({
    items: rows.map(mapAdminSlide),
    meta: paginationMeta(total, query.page, query.limit),
  });
}

export async function adminGetSlide(id: string) {
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) {
    throw new ApiError("Slide not found", 404);
  }
  return ok(mapAdminSlide(slide));
}

export async function adminCreateSlide(input: CreateInput) {
  if (input.id) {
    const conflict = await prisma.heroSlide.findUnique({
      where: { id: input.id },
      select: { id: true },
    });
    if (conflict) {
      throw new ApiError("A slide with this id already exists", 409);
    }
  }

  const slide = await prisma.heroSlide.create({
    data: {
      ...(input.id ? { id: input.id } : {}),
      eyebrow: input.eyebrow,
      eyebrowAr: input.eyebrowAr?.trim() || null,
      title: input.title,
      titleAr: input.titleAr?.trim() || null,
      description: input.description,
      descriptionAr: input.descriptionAr?.trim() || null,
      ctaLabel: input.ctaLabel,
      ctaLabelAr: input.ctaLabelAr?.trim() || null,
      imageAlt: input.imageAlt,
      imageAltAr: input.imageAltAr?.trim() || null,
      imagePath: input.imagePath,
      href: input.href,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });

  return ok(mapAdminSlide(slide), { status: 201 });
}

export async function adminUpdateSlide(id: string, input: UpdateInput) {
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Slide not found", 404);
  }

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...(input.eyebrow !== undefined ? { eyebrow: input.eyebrow } : {}),
      ...(input.eyebrowAr !== undefined
        ? { eyebrowAr: input.eyebrowAr?.trim() || null }
        : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.titleAr !== undefined
        ? { titleAr: input.titleAr?.trim() || null }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.descriptionAr !== undefined
        ? { descriptionAr: input.descriptionAr?.trim() || null }
        : {}),
      ...(input.ctaLabel !== undefined ? { ctaLabel: input.ctaLabel } : {}),
      ...(input.ctaLabelAr !== undefined
        ? { ctaLabelAr: input.ctaLabelAr?.trim() || null }
        : {}),
      ...(input.imageAlt !== undefined ? { imageAlt: input.imageAlt } : {}),
      ...(input.imageAltAr !== undefined
        ? { imageAltAr: input.imageAltAr?.trim() || null }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(input.href !== undefined ? { href: input.href } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });

  return ok(mapAdminSlide(slide));
}

export async function adminDeleteSlide(id: string) {
  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Slide not found", 404);
  }

  await prisma.heroSlide.delete({ where: { id } });
  return ok({ id, deleted: true });
}
