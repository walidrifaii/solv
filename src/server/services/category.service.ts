import { prisma } from "@/lib/db";
import { ApiError } from "@/server/utils/http";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";

function mapCategory(category: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}) {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
    productCount: category._count?.products ?? undefined,
  };
}

export async function listCategories(query: { page: number; limit: number }) {
  const where = { isActive: true };
  const { skip, take } = paginate(query.page, query.limit);

  const [total, rows] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take,
    }),
  ]);

  return {
    items: rows.map(mapCategory),
    meta: paginationMeta(total, query.page, query.limit),
  };
}

export async function getCategoryByIdOrSlug(idOrSlug: string) {
  const category = await prisma.category.findFirst({
    where: {
      isActive: true,
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  return mapCategory(category);
}
