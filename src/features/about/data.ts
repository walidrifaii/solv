import type { ComponentType } from "react";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { DeliveryTruckIcon } from "@/components/icons/DeliveryTruckIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { ShieldCheckIcon } from "@/components/icons/ShieldCheckIcon";
import { ROUTES } from "@/constants/routes";

export const aboutHero = {
  eyebrow: "About Solv",
  brand: "SOLV",
  title: "Coffee & tea, chosen with care",
  description:
    "We bring premium coffee and tea to Qatar — for homes, cafés, and anyone who values a better cup.",
  primaryCta: {
    label: "Shop Collection",
    href: ROUTES.shop,
  },
  secondaryCta: {
    label: "Talk to Us",
    href: ROUTES.contact,
  },
} as const;

export const aboutStory = {
  eyebrow: "Our Story",
  title: "A supplier built around true taste",
  paragraphs: [
    "SOLV was founded in Qatar with a simple purpose: make exceptional coffee and tea easy to discover, order, and enjoy — without compromising on origin, freshness, or service.",
    "We work with trusted growers and producers, then curate every product for aroma, balance, and everyday excellence. From single-origin beans to refined tea leaves and thoughtful accessories, each item earns its place on our shelves.",
    "Whether you brew at home or supply a café, we deliver quality you can taste — and support you can rely on across Doha and beyond.",
  ],
  highlight: {
    label: "Based in Qatar",
    value: "Serving coffee & tea lovers nationwide",
  },
} as const;

export type AboutValue = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
};

export const aboutValues: AboutValue[] = [
  {
    id: "integrity",
    title: "Sourced with Integrity",
    description:
      "We partner with growers and producers who prioritize quality, consistency, and care at origin.",
    Icon: CoffeeBeansIcon,
  },
  {
    id: "quality",
    title: "Selected for Flavor",
    description:
      "Every lot is chosen for aroma, balance, and character — not just labels or trend.",
    Icon: ShieldCheckIcon,
  },
  {
    id: "delivery",
    title: "Delivered Across Qatar",
    description:
      "Reliable fulfilment from Doha outward, so freshness arrives when you need it.",
    Icon: DeliveryTruckIcon,
  },
  {
    id: "support",
    title: "Guided by People",
    description:
      "Real support for homes, hospitality, and café partners — before and after you order.",
    Icon: HeadsetIcon,
  },
];

export const aboutJourney = {
  eyebrow: "How We Work",
  title: "From origin to your cup",
  description:
    "A quiet, careful process behind every product we offer.",
  steps: [
    {
      id: "source",
      number: "01",
      title: "Source",
      description:
        "We identify exceptional coffee and tea from respected growing regions around the world.",
    },
    {
      id: "curate",
      number: "02",
      title: "Curate",
      description:
        "Each selection is evaluated for purity, aroma, and how it performs in real everyday brewing.",
    },
    {
      id: "prepare",
      number: "03",
      title: "Prepare",
      description:
        "Beans, blends, leaves, and accessories are prepared and packed to protect freshness and flavor.",
    },
    {
      id: "deliver",
      number: "04",
      title: "Deliver",
      description:
        "Orders reach homes and businesses across Qatar with clear service and dependable timing.",
    },
  ],
} as const;

export const aboutPromise = {
  eyebrow: "Our Promise",
  title: "Quality you can taste. Service you can trust.",
  description:
    "From the first sip to the last refill, SOLV is here to elevate the coffee and tea experience in Qatar — thoughtfully, consistently, and without the noise.",
  cta: {
    label: "Explore Products",
    href: ROUTES.shop,
  },
} as const;

export const aboutFacts = [
  { label: "Focus", value: "Premium coffee & tea" },
  { label: "Location", value: "Doha, Qatar" },
  { label: "Service", value: "Home & hospitality" },
  { label: "Care", value: "Handpicked quality" },
] as const;
