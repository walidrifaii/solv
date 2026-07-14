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
  eyebrow: "Our Services",
  brand: "SOLV",
  title: "Supply, delivery, and care for every brew",
  description:
    "From home kitchens to cafés and hospitality partners — SOLV supports Qatar with premium coffee, tea, and dependable service.",
  primaryCta: {
    label: "Request Service",
    href: ROUTES.contact,
  },
  secondaryCta: {
    label: "Browse Shop",
    href: ROUTES.shop,
  },
} as const;

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  points: readonly string[];
  Icon: ComponentType<{ className?: string }>;
};

export const serviceItems: ServiceItem[] = [
  {
    id: "home-supply",
    title: "Home & Office Supply",
    description:
      "Curated coffee, tea, and accessories for everyday brewing — delivered with freshness in mind.",
    points: ["Beans, ground & tea", "Repeat-friendly ordering", "Everyday essentials"],
    Icon: CupIcon,
  },
  {
    id: "hospitality",
    title: "Café & Hospitality Supply",
    description:
      "Reliable product supply for cafés, hotels, and restaurants that need consistent quality at volume.",
    points: ["Menu-ready selections", "Steady replenishment", "Partner support"],
    Icon: BuildingIcon,
  },
  {
    id: "wholesale",
    title: "Bulk & Wholesale Orders",
    description:
      "Larger quantities for businesses and events, with guidance on product fit and quantity planning.",
    points: ["Flexible order sizes", "Clear lead times", "Business-friendly service"],
    Icon: CoffeeBeansIcon,
  },
  {
    id: "delivery",
    title: "Delivery Across Qatar",
    description:
      "Dependable fulfilment from Doha outward so coffee and tea arrive when your schedule needs them.",
    points: ["Nationwide reach", "Careful packing", "Trackable support"],
    Icon: DeliveryTruckIcon,
  },
  {
    id: "gifting",
    title: "Corporate & Gift Sets",
    description:
      "Thoughtful coffee and tea gift sets for clients, teams, and special occasions — ready to impress.",
    points: ["Ready-made sets", "Corporate options", "Premium presentation"],
    Icon: GiftBoxIcon,
  },
  {
    id: "consultation",
    title: "Product Guidance",
    description:
      "Help choosing the right roast, tea style, or accessory — for home setups or professional menus.",
    points: ["Taste-led recommendations", "Brew tips", "Dedicated advisors"],
    Icon: ClipboardIcon,
  },
];

export const servicesAudience = {
  eyebrow: "Who We Serve",
  title: "Built for every kind of coffee & tea moment",
  description:
    "Whether you brew for one or fill a busy floor, SOLV adapts to how you work.",
  groups: [
    {
      id: "homes",
      title: "Homes & Offices",
      description:
        "Premium everyday coffee and tea with simple ordering and reliable delivery.",
    },
    {
      id: "cafes",
      title: "Cafés & Restaurants",
      description:
        "Consistent supply and product guidance so your cups stay true service after service.",
    },
    {
      id: "hospitality",
      title: "Hotels & Events",
      description:
        "Scalable fulfilment for guest experiences, corporate gifting, and special occasions.",
    },
  ],
} as const;

export const servicesProcess = {
  eyebrow: "How It Works",
  title: "Simple from first message to first delivery",
  description: "A clear path to getting the right coffee and tea into your space.",
  steps: [
    {
      id: "share",
      number: "01",
      title: "Share your needs",
      description:
        "Tell us what you brew, how often you need it, and who you serve.",
    },
    {
      id: "curate",
      number: "02",
      title: "Get a curated plan",
      description:
        "We recommend products, quantities, and options that fit your setup.",
    },
    {
      id: "confirm",
      number: "03",
      title: "Confirm & schedule",
      description:
        "Approve your order, delivery window, and any recurring supply needs.",
    },
    {
      id: "enjoy",
      number: "04",
      title: "Receive & enjoy",
      description:
        "Your coffee and tea arrive carefully packed — with support whenever you need it.",
    },
  ],
} as const;

export const servicesSupport = {
  eyebrow: "Always Nearby",
  title: "Real people. Clear answers.",
  description:
    "Questions about roast profiles, tea selections, wholesale timing, or gift orders — our team is here to help before and after every purchase.",
  highlight: {
    phone: "+974 3000 1234",
    phoneHref: "tel:+97430001234",
    email: "info@solvcoffee.qa",
    emailHref: "mailto:info@solvcoffee.qa",
    hours: "Mon – Sat · 8:00 AM – 8:00 PM",
  },
  Icon: HeadsetIcon,
} as const;

export const servicesCta = {
  eyebrow: "Start With Solv",
  title: "Ready for better coffee & tea service?",
  description:
    "Tell us what you need — supply, delivery, wholesale, or gifts — and we'll shape a simple plan around it.",
  cta: {
    label: "Contact Our Team",
    href: ROUTES.contact,
  },
} as const;
