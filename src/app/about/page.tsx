import type { Metadata } from "next";
import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutJourney } from "@/features/about/components/AboutJourney";
import { AboutPromise } from "@/features/about/components/AboutPromise";
import { AboutStory } from "@/features/about/components/AboutStory";
import { AboutValues } from "@/features/about/components/AboutValues";

export const metadata: Metadata = {
  title: "About Us | Solv",
  description:
    "Learn about SOLV — Qatar's premium coffee and tea supplier. Our story, values, and promise of handpicked quality.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutJourney />
      <AboutPromise />
    </main>
  );
}
