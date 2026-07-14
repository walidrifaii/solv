import type { ComponentType } from "react";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DeliveryTruckIcon } from "@/components/icons/DeliveryTruckIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { ShieldCheckIcon } from "@/components/icons/ShieldCheckIcon";

export type ExperienceFeature = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
};

export const experienceFeatures: ExperienceFeature[] = [
  {
    id: "premium-quality",
    title: "Premium Quality",
    description: "Carefully sourced from the world's best farms.",
    Icon: CoffeeBeansIcon,
  },
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    description: "Quick and reliable delivery across Qatar.",
    Icon: DeliveryTruckIcon,
  },
  {
    id: "secure-payments",
    title: "Secure Payments",
    description: "100% safe and secure checkout.",
    Icon: ShieldCheckIcon,
  },
  {
    id: "dedicated-support",
    title: "Dedicated Support",
    description: "We're here to help you every step of the way.",
    Icon: HeadsetIcon,
  },
];
