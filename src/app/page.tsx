import { FeaturedItems } from "@/features/home/components/FeaturedItems";
import { HandpickedQuality } from "@/features/home/components/HandpickedQuality";
import { Hero } from "@/features/home/components/Hero";
import { HotDeals } from "@/features/home/components/HotDeals";
import { MachinesGrinders } from "@/features/home/components/MachinesGrinders";
import { PromoBanners } from "@/features/home/components/PromoBanners";
import { SpecialtyCoffeeCrops } from "@/features/home/components/SpecialtyCoffeeCrops";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <MachinesGrinders />
      <PromoBanners />
      <SpecialtyCoffeeCrops />
      <HandpickedQuality />
      <FeaturedItems />
      <HotDeals />
    </main>
  );
}
