import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import type { CategoryCard } from "@/data/categories";

type CategoryCardItemProps = {
  category: CategoryCard;
  className?: string;
};

export function CategoryCardItem({ category, className = "" }: CategoryCardItemProps) {
  return (
    <Link
      href={category.href}
      className={`group flex min-h-[240px] flex-col items-center rounded-2xl bg-[#F6EDE6] px-3 pb-5 pt-5 text-center transition-shadow hover:shadow-[0_10px_30px_rgba(42,31,22,0.08)] sm:min-h-[260px] sm:px-4 sm:pb-6 sm:pt-6 md:min-h-[280px] ${className}`}
    >
      <div className="relative mb-4 flex aspect-square w-full max-w-[140px] flex-1 items-center justify-center sm:max-w-[150px] md:max-w-[160px]">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          sizes="(max-width: 1024px) 45vw, 160px"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="font-serif text-base font-semibold text-[#2a1f16] sm:text-lg">
        {category.name}
      </h3>
      <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#6b5b4d] transition-colors group-hover:text-[#b0895b] sm:text-sm">
        Shop Now
        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
