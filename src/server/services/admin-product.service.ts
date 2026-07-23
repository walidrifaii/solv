import type { Prisma } from "@/generated/prisma";
import { DiscountType, Prisma as PrismaNs } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { toNumber } from "@/server/utils/crypto";
import { ApiError, ok } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";
import { slugify } from "@/server/utils/slugify";
import type {
  adminProductListQuerySchema,
  createProductSchema,
  updateProductSchema,
} from "@/server/validators/schemas";
import type { z } from "zod";

type ListQuery = z.infer<typeof adminProductListQuerySchema>;
type CreateInput = z.infer<typeof createProductSchema>;
type UpdateInput = z.infer<typeof updateProductSchema>;

function mapAdminProduct(product: {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  price: Prisma.Decimal;
  discountType: string | null;
  discount: Prisma.Decimal | null;
  imagePath: string;
  quantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    slug: string;
    name: string;
    nameAr: string | null;
  } | null;
}) {
  const price = toNumber(product.price) ?? 0;
  const discount = toNumber(product.discount);
  let finalPrice = price;

  if (product.discountType === "FIXED" && discount != null) {
    finalPrice = Math.max(0, price - discount);
  } else if (product.discountType === "PERCENTAGE" && discount != null) {
    finalPrice = Math.max(0, price - (price * discount) / 100);
  }

  return {
    id: product.id,
    slug: product.slug,
    categoryId: product.categoryId,
    name: product.name,
    nameAr: product.nameAr,
    description: product.description,
    descriptionAr: product.descriptionAr,
    price,
    discountType: product.discountType as "FIXED" | "PERCENTAGE" | null,
    discount,
    finalPrice: Number(finalPrice.toFixed(2)),
    imagePath: product.imagePath,
    quantity: product.quantity,
    inStock: product.inStock,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category
      ? {
          id: product.category.id,
          slug: product.category.slug,
          name: product.category.name,
          nameAr: product.category.nameAr,
        }
      : undefined,
  };
}

const includeCategory = {
  category: { select: { id: true, slug: true, name: true, nameAr: true } },
} as const;

function toDiscountType(
  value: "FIXED" | "PERCENTAGE" | null | undefined,
): DiscountType | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return value === "FIXED" ? DiscountType.FIXED : DiscountType.PERCENTAGE;
}

export async function adminListProducts(query: ListQuery) {
  const where: Prisma.ProductWhereInput = {
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.featured !== undefined ? { isFeatured: query.featured } : {}),
    ...(query.inStock !== undefined ? { inStock: query.inStock } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { nameAr: { contains: query.search } },
            { slug: { contains: query.search } },
            { description: { contains: query.search } },
            { descriptionAr: { contains: query.search } },
          ],
        }
      : {}),
  };

  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: includeCategory,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take,
    }),
  ]);

  return ok({
    items: rows.map(mapAdminProduct),
    meta: paginationMeta(total, query.page, query.limit),
  });
}

export async function adminGetProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: includeCategory,
  });

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return ok(mapAdminProduct(product));
}

export async function adminCreateProduct(input: CreateInput) {
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
    select: { id: true },
  });
  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  const slug = input.slug ?? slugify(input.name);
  if (!slug) {
    throw new ApiError("Could not derive a slug from the name", 400);
  }
  const id = input.id ?? slug;

  const conflict = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug }] },
    select: { id: true },
  });
  if (conflict) {
    throw new ApiError("A product with this id or slug already exists", 409);
  }

  const product = await prisma.product.create({
    data: {
      id,
      slug,
      categoryId: input.categoryId,
      name: input.name,
      nameAr: input.nameAr?.trim() || null,
      description: input.description,
      descriptionAr: input.descriptionAr?.trim() || null,
      price: new PrismaNs.Decimal(input.price),
      discountType: toDiscountType(input.discountType ?? null) ?? null,
      discount:
        input.discount == null ? null : new PrismaNs.Decimal(input.discount),
      imagePath: input.imagePath,
      quantity: input.quantity,
      inStock: input.inStock,
      isFeatured: input.isFeatured,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
    include: includeCategory,
  });

  return ok(mapAdminProduct(product), { status: 201 });
}

export async function adminUpdateProduct(id: string, input: UpdateInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Product not found", 404);
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new ApiError("Category not found", 404);
    }
  }

  if (input.slug && input.slug !== existing.slug) {
    const taken = await prisma.product.findFirst({
      where: { slug: input.slug, NOT: { id } },
      select: { id: true },
    });
    if (taken) {
      throw new ApiError("Slug already in use", 409);
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.categoryId !== undefined
        ? { categoryId: input.categoryId }
        : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.nameAr !== undefined
        ? { nameAr: input.nameAr?.trim() || null }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.descriptionAr !== undefined
        ? { descriptionAr: input.descriptionAr?.trim() || null }
        : {}),
      ...(input.price !== undefined
        ? { price: new PrismaNs.Decimal(input.price) }
        : {}),
      ...(input.discountType !== undefined
        ? { discountType: toDiscountType(input.discountType) ?? null }
        : {}),
      ...(input.discount !== undefined
        ? {
            discount:
              input.discount == null
                ? null
                : new PrismaNs.Decimal(input.discount),
          }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
      ...(input.inStock !== undefined ? { inStock: input.inStock } : {}),
      ...(input.isFeatured !== undefined
        ? { isFeatured: input.isFeatured }
        : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
    include: includeCategory,
  });

  return ok(mapAdminProduct(product));
}

export async function adminDeleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError("Product not found", 404);
  }

  await prisma.product.delete({ where: { id } });
  return ok({ id, deleted: true });
}
