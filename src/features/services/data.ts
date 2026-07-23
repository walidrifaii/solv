import type { ComponentType } from "react";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DeliveryTruckIcon } from "@/components/icons/DeliveryTruckIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import {
  BuildingIcon,
  ClipboardIcon,
  CupIcon,
  GiftBoxIcon,
} from "@/components/icons/ServiceIcons";
import { ROUTES } from "@/constants/routes";

export const servicesHero = {
  brand: "SOLV",
  primaryCta: { href: ROUTES.contact },
  secondaryCta: { href: ROUTES.shop },
} as const;

export type ServiceItem = {
  id: string;
  pointCount: number;
  Icon: ComponentType<{ className?: string }>;
};

export const serviceItems: ServiceItem[] = [
  { id: "home-supply", pointCount: 3, Icon: CupIcon },
  { id: "hospitality", pointCount: 3, Icon: BuildingIcon },
  { id: "wholesale", pointCount: 3, Icon: CoffeeBeansIcon },
  { id: "delivery", pointCount: 3, Icon: DeliveryTruckIcon },
  { id: "gifting", pointCount: 3, Icon: GiftBoxIcon },
  { id: "consultation", pointCount: 3, Icon: ClipboardIcon },
];

export const servicesAudience = {
  groupIds: ["homes", "cafes", "hospitality"],
} as const;

export const servicesProcess = {
  steps: [
    { id: "share", number: "01" },
    { id: "curate", number: "02" },
    { id: "confirm", number: "03" },
    { id: "enjoy", number: "04" },
  ],
} as const;

export const servicesSupport = {
  highlight: {
    phone: "+974 3000 1234",
    phoneHref: "tel:+97430001234",
    email: "info@solvcoffee.qa",
    emailHref: "mailto:info@solvcoffee.qa",
  },
  Icon: HeadsetIcon,
} as const;

export const servicesCta = {
  cta: { href: ROUTES.contact },
} as const;
