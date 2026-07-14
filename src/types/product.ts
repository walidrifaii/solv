import type { StaticImageData } from "next/image";
import type { Id } from "@/types/common";

export type Product = {
  id: Id;
  name: string;
  description?: string;
  price: number;
  categoryId?: Id;
};

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  categoryId: string;
  categoryLabel: string;
  image: StaticImageData;
  imageAlt: string;
  badges?: readonly string[];
  details: readonly { label: string; value: string }[];
  highlights: readonly string[];
  inStock: boolean;
};
