import { ROUTES } from "@/constants/routes";

export function slideHref(
  categoryId: string | null | undefined,
  href?: string | null,
) {
  if (categoryId) return ROUTES.shopCategory(categoryId);
  return href?.trim() || ROUTES.shop;
}
