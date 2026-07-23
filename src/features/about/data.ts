import type { ComponentType } from "react";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DeliveryTruckIcon } from "@/components/icons/DeliveryTruckIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { ShieldCheckIcon } from "@/components/icons/ShieldCheckIcon";
import { ROUTES } from "@/constants/routes";

export const aboutHero = {
  brand: "SOLV",
  primaryCta: { href: ROUTES.shop },
  secondaryCta: { href: ROUTES.contact },
} as const;

export const aboutStory = {
  paragraphIds: ["p1", "p2", "p3"],
} as const;

export type AboutValue = {
  id: string;
  Icon: ComponentType<{ className?: string }>;
};

export const aboutValues: AboutValue[] = [
  { id: "integrity", Icon: CoffeeBeansIcon },
  { id: "quality", Icon: ShieldCheckIcon },
  { id: "delivery", Icon: DeliveryTruckIcon },
  { id: "support", Icon: HeadsetIcon },
];

export const aboutJourney = {
  steps: [
    { id: "source", number: "01" },
    { id: "curate", number: "02" },
    { id: "prepare", number: "03" },
    { id: "deliver", number: "04" },
  ],
} as const;

export const aboutPromise = {
  cta: { href: ROUTES.shop },
} as const;

export const aboutFacts = ["focus", "location", "service", "care"] as const;
