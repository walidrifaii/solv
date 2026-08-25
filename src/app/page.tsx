import { FeaturedItems } from "@/features/home/components/FeaturedItems";
import { HandpickedQuality } from "@/features/home/components/HandpickedQuality";
import { Hero } from "@/features/home/components/Hero";
import { HotDeals } from "@/features/home/components/HotDeals";
import { MachinesGrinders } from "@/features/home/components/MachinesGrinders";
import { Newsletter } from "@/features/home/components/Newsletter";
import { PromoBanners } from "@/features/home/components/PromoBanners";
import { ShopByCategory } from "@/features/home/components/ShopByCategory";
import { SolvExperience } from "@/features/home/components/SolvExperience";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <PromoBanners />
      <ShopByCategory />
      <MachinesGrinders />
      <FeaturedItems />
      <HandpickedQuality />
      <SolvExperience />
      <HotDeals />
      <Newsletter />
    </main>
  );
}
