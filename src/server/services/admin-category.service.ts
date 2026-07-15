import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { ApiError, ok } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";
import { slugify } from "@/server/utils/slugify";
import type {
  adminCategoryListQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminCategoryListQuerySchema>;
type CreateInput = z.infer<typeof createCategorySchema>;
type UpdateInput = z.infer<typeof updateCategorySchema>;

function mapAdminCategory(category: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imagePath: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    imagePath: category.imagePath,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    productCount: category._count?.products ?? 0,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

const includeCount = {
  _count: { select: { products: true } },
} as const;

export async function adminListCategories(query: ListQuery) {
  const where: Prisma.CategoryWhereInput = {
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { slug: { contains: query.search } },
            { description: { contains: query.search } },
          ],
        }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      include: includeCount,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take,
    }),
  ]);

  return ok(
    {
      items: rows.map(mapAdminCategory),
      meta: paginationMeta(total, query.page, query.limit),
    },
  );
}

export async function adminGetCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: includeCount,
  });

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  return ok(mapAdminCategory(category));
}

export async function adminCreateCategory(input: CreateInput) {
  const slug = input.slug ?? slugify(input.name);
  if (!slug) {
    throw new ApiError("Could not derive a slug from the name", 400);
  }

  const id = input.id ?? slug;

  const conflict = await prisma.category.findFirst({
    where: { OR: [{ id }, { slug }] },
    select: { id: true },
  });
  if (conflict) {
    throw new ApiError("A category with this id or slug already exists", 409);
  }

  const category = await prisma.category.create({
    data: {
      id,
      slug,
      name: input.name,
      description: input.description ?? null,
      imagePath: input.imagePath,
      sortOrder: input.sortOrder,
      isActive: input.isActive,
    },
    include: includeCount,
  });

  return ok(mapAdminCategory(category), { status: 201 });
}

export async function adminUpdateCategory(id: string, input: UpdateInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Category not found", 404);
  }

  if (input.slug && input.slug !== existing.slug) {
    const taken = await prisma.category.findFirst({
      where: { slug: input.slug, NOT: { id } },
      select: { id: true },
    });
    if (taken) {
      throw new ApiError("Slug already in use", 409);
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
    include: includeCount,
  });

  return ok(mapAdminCategory(category));
}

export async function adminDeleteCategory(id: string) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!existing) {
    throw new ApiError("Category not found", 404);
  }

  if (existing._count.products > 0) {
    throw new ApiError(
      "Cannot delete a category that still has products. Move or delete products first, or set isActive to false.",
      409,
    );
  }

  await prisma.category.delete({ where: { id } });
  return ok({ id, deleted: true });
}
