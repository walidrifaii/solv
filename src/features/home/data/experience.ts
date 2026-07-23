import type { ComponentType } from "react";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DeliveryTruckIcon } from "@/components/icons/DeliveryTruckIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { ShieldCheckIcon } from "@/components/icons/ShieldCheckIcon";

export type ExperienceFeature = {
  id: string;
  Icon: ComponentType<{ className?: string }>;
};

export const experienceFeatures: ExperienceFeature[] = [
  { id: "premium-quality", Icon: CoffeeBeansIcon },
  { id: "fast-delivery", Icon: DeliveryTruckIcon },
  { id: "secure-payments", Icon: ShieldCheckIcon },
  { id: "dedicated-support", Icon: HeadsetIcon },
];
