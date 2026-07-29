import { prisma } from "@/lib/db";
import {
  paginate,
  paginationMeta,
} from "@/server/utils/pagination";

function mapSlide(slide: {
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
  };
}

export async function listActiveSlides(query: { page: number; limit: number }) {
  const where = { isActive: true };
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

  return {
    items: rows.map(mapSlide),
    meta: paginationMeta(total, query.page, query.limit),
  };
}
