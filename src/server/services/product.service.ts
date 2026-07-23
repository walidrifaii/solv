import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { toNumber } from "@/server/utils/crypto";
import { ApiError } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";

function mapProduct(product: {
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
    discountType: product.discountType,
    discount,
    finalPrice: Number(finalPrice.toFixed(2)),
    imagePath: product.imagePath,
    quantity: product.quantity,
    inStock: product.inStock,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
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

const categorySelect = {
  id: true,
  slug: true,
  name: true,
  nameAr: true,
} as const;

export async function listProducts(query: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
  featured?: boolean;
  inStock?: boolean;
}) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.featured !== undefined ? { isFeatured: query.featured } : {}),
    ...(query.inStock !== undefined ? { inStock: query.inStock } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { nameAr: { contains: query.search } },
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
      include: {
        category: { select: categorySelect },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take,
    }),
  ]);

  return {
    items: rows.map(mapProduct),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: { select: categorySelect },
    },
  });

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  return mapProduct(product);
}
