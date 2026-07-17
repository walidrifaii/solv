import Image from "next/image";
import Link from "next/link";
import type { CategoryCard } from "@/data/categories";

type CategoryCardItemProps = {
  category: CategoryCard;
  className?: string;
};

export function CategoryCardItem({
  category,
  className = "",
}: CategoryCardItemProps) {
  return (
    <Link
      href={category.href}
      className={`group flex flex-col items-center gap-3 text-center sm:gap-3.5 ${className}`}
    >
      <div className="relative aspect-square w-full max-w-[9.5rem] overflow-hidden rounded-full bg-[#F6EDE6] ring-1 ring-[#e8d9cc]/80 transition-[box-shadow,transform] duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_12px_28px_rgba(42,31,22,0.1)] group-focus-visible:ring-2 group-focus-visible:ring-[#c4a574] sm:max-w-[10.5rem] md:max-w-[11.5rem] lg:max-w-[12rem]">
        <Image
          src={category.imagePath}
          alt={category.imageAlt}
          fill
          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 28vw, 192px"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105 sm:p-5"
        />
      </div>

      <h3 className="font-serif text-base font-semibold text-[#2a1f16] transition-colors group-hover:text-[#b0895b] sm:text-lg md:text-xl lg:text-[1.35rem]">
        {category.name}
      </h3>
    </Link>
  );
}
