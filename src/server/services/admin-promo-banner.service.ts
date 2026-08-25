import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { slideHref } from "@/lib/slide-href";
import { ApiError, ok } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";
import type {
  adminPromoBannerListQuerySchema,
  createPromoBannerSchema,
  updatePromoBannerSchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminPromoBannerListQuerySchema>;
type CreateInput = z.infer<typeof createPromoBannerSchema>;
type UpdateInput = z.infer<typeof updatePromoBannerSchema>;

async function assertCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    throw new ApiError("Category not found", 400);
  }
}

function mapAdminBanner(banner: {
  id: string;
  imageAlt: string;
  imageAltAr: string | null;
  imagePath: string;
  href: string;
  categoryId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: banner.id,
    imageAlt: banner.imageAlt,
    imageAltAr: banner.imageAltAr,
    imagePath: banner.imagePath,
    href: slideHref(banner.categoryId, banner.href),
    categoryId: banner.categoryId,
    sortOrder: banner.sortOrder,
    isActive: banner.isActive,
    createdAt: banner.createdAt.toISOString(),
    updatedAt: banner.updatedAt.toISOString(),
  };
}

export async function adminListPromoBanners(query: ListQuery) {
  const where: Prisma.PromoBannerWhereInput = {
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search
      ? {
          OR: [
            { imageAlt: { contains: query.search } },
            { imageAltAr: { contains: query.search } },
            { categoryId: { contains: query.search } },
          ],
        }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.promoBanner.count({ where }),
    prisma.promoBanner.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip,
      take,
    }),
  ]);

  return ok({
    items: rows.map(mapAdminBanner),
    meta: paginationMeta(total, query.page, query.limit),
  });
}

export async function adminGetPromoBanner(id: string) {
  const banner = await prisma.promoBanner.findUnique({ where: { id } });
  if (!banner) {
    throw new ApiError("Banner not found", 404);
  }
  return ok(mapAdminBanner(banner));
}

export async function adminCreatePromoBanner(input: CreateInput) {
  if (input.id) {
    const conflict = await prisma.promoBanner.findUnique({
      where: { id: input.id },
      select: { id: true },
    });
    if (conflict) {
      throw new ApiError("A banner with this id already exists", 409);
    }
  }

  await assertCategory(input.categoryId);
  const href = slideHref(input.categoryId, input.href);

  const banner = await prisma.promoBanner.create({
    data: {
      ...(input.id ? { id: input.id } : {}),
      imageAlt: input.imageAlt,
      imageAltAr: input.imageAltAr?.trim() || null,
      imagePath: input.imagePath,
      href,
      categoryId: input.categoryId,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
  });

  return ok(mapAdminBanner(banner), { status: 201 });
}

export async function adminUpdatePromoBanner(id: string, input: UpdateInput) {
  const existing = await prisma.promoBanner.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Banner not found", 404);
  }

  const nextCategoryId =
    input.categoryId !== undefined ? input.categoryId : existing.categoryId;
  if (input.categoryId !== undefined) {
    await assertCategory(input.categoryId);
  }

  const href =
    input.categoryId !== undefined || input.href !== undefined
      ? slideHref(nextCategoryId, input.href ?? existing.href)
      : undefined;

  const banner = await prisma.promoBanner.update({
    where: { id },
    data: {
      ...(input.imageAlt !== undefined ? { imageAlt: input.imageAlt } : {}),
      ...(input.imageAltAr !== undefined
        ? { imageAltAr: input.imageAltAr?.trim() || null }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(href !== undefined ? { href } : {}),
      ...(input.categoryId !== undefined
        ? { categoryId: input.categoryId }
        : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
  });

  return ok(mapAdminBanner(banner));
}

export async function adminDeletePromoBanner(id: string) {
  const existing = await prisma.promoBanner.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Banner not found", 404);
  }

  await prisma.promoBanner.delete({ where: { id } });
  return ok({ id, deleted: true });
}
