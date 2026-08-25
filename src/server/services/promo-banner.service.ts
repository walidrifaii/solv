import { prisma } from "@/lib/db";
import { slideHref } from "@/lib/slide-href";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";

function mapBanner(banner: {
  id: string;
  imageAlt: string;
  imageAltAr: string | null;
  imagePath: string;
  href: string;
  categoryId: string | null;
  sortOrder: number;
}) {
  return {
    id: banner.id,
    imageAlt: banner.imageAlt,
    imageAltAr: banner.imageAltAr,
    imagePath: banner.imagePath,
    href: slideHref(banner.categoryId, banner.href),
    categoryId: banner.categoryId,
    sortOrder: banner.sortOrder,
  };
}

export async function listActivePromoBanners(query: {
  page: number;
  limit: number;
}) {
  const where = { isActive: true };
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

  return {
    items: rows.map(mapBanner),
    meta: paginationMeta(total, query.page, query.limit),
  };
}
