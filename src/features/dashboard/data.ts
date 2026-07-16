import { ROUTES } from "@/constants/routes";

export type DashboardNavItem = {
  label: string;
  href: string;
  description: string;
};

export const dashboardNav: DashboardNavItem[] = [
  {
    label: "Overview",
    href: ROUTES.dashboard,
    description: "Summary and activity",
  },
  {
    label: "Orders",
    href: ROUTES.dashboardOrders,
    description: "Track and fulfill orders",
  },
  {
    label: "Products",
    href: ROUTES.dashboardProducts,
    description: "Catalog inventory",
  },
  {
    label: "Categories",
    href: ROUTES.dashboardCategories,
    description: "Shop collections",
  },
  {
    label: "Subscribers",
    href: ROUTES.dashboardSubscribers,
    description: "Newsletter list",
  },
];

/** UI mock data only — not wired to API yet */
export const dashboardMock = {
  stats: [
    {
      id: "orders",
      label: "Orders today",
      value: "18",
      hint: "+4 vs yesterday",
      tone: "gold" as const,
    },
    {
      id: "revenue",
      label: "Revenue (QAR)",
      value: "4,280",
      hint: "Last 24 hours",
      tone: "dark" as const,
    },
    {
      id: "stock",
      label: "Low stock",
      value: "3",
      hint: "Needs restock soon",
      tone: "warn" as const,
    },
    {
      id: "subscribers",
      label: "Subscribers",
      value: "126",
      hint: "+9 this week",
      tone: "cream" as const,
    },
  ],
  recentOrders: [
    {
      id: "1",
      orderNumber: "SOLV-8F2A1C",
      guest: "Sara Al-Thani",
      total: 148,
      status: "PENDING",
      items: 2,
      city: "Doha",
      createdAt: "Today · 09:14",
    },
    {
      id: "2",
      orderNumber: "SOLV-7B91E0",
      guest: "Hassan M.",
      total: 220,
      status: "CONFIRMED",
      items: 3,
      city: "Lusail",
      createdAt: "Today · 08:42",
    },
    {
      id: "3",
      orderNumber: "SOLV-6C44AD",
      guest: "Noura K.",
      total: 69,
      status: "PREPARING",
      items: 1,
      city: "West Bay",
      createdAt: "Yesterday · 21:05",
    },
    {
      id: "4",
      orderNumber: "SOLV-5A10BF",
      guest: "James R.",
      total: 310,
      status: "OUT_FOR_DELIVERY",
      items: 4,
      city: "The Pearl",
      createdAt: "Yesterday · 16:22",
    },
    {
      id: "5",
      orderNumber: "SOLV-4912CE",
      guest: "Fatima S.",
      total: 95,
      status: "DELIVERED",
      items: 2,
      city: "Al Rayyan",
      createdAt: "Yesterday · 11:08",
    },
  ],
  lowStock: [
    { name: "Espresso Blend", qty: 4, category: "Coffee Beans" },
    { name: "English Breakfast", qty: 6, category: "Tea" },
    { name: "Coffee Gift Set", qty: 2, category: "Gift Sets" },
  ],
  productsPreview: [
    {
      name: "Premium Arabica Beans",
      category: "Coffee Beans",
      price: 69,
      stock: 42,
      active: true,
    },
    {
      name: "House Blend",
      category: "Coffee Beans",
      price: 55,
      stock: 28,
      active: true,
    },
    {
      name: "Classic Roast",
      category: "Ground Coffee",
      price: 48,
      stock: 15,
      active: true,
    },
    {
      name: "Green Tea",
      category: "Tea",
      price: 39,
      stock: 8,
      active: true,
    },
  ],
  categoriesPreview: [
    { name: "Coffee Beans", products: 12, active: true },
    { name: "Ground Coffee", products: 6, active: true },
    { name: "Tea", products: 9, active: true },
    { name: "Tea Bags", products: 5, active: true },
    { name: "Accessories", products: 7, active: true },
    { name: "Gift Sets", products: 4, active: true },
  ],
  subscribersPreview: [
    { email: "guest@example.com", status: "Active", joined: "12 Jul 2026" },
    { email: "cafe@doha.qa", status: "Active", joined: "10 Jul 2026" },
    { email: "team@hotel.qa", status: "Active", joined: "08 Jul 2026" },
  ],
};

export function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export const ORDER_STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export function formatOrderDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function statusTone(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-[#f3e6d4] text-[#8a6a3d]";
    case "CONFIRMED":
      return "bg-[#e8f0e4] text-[#4f6b45]";
    case "PREPARING":
      return "bg-[#e7eef6] text-[#3f5a7a]";
    case "OUT_FOR_DELIVERY":
      return "bg-[#efe6f6] text-[#6a4f7a]";
    case "DELIVERED":
      return "bg-[#e6f2ec] text-[#2f6b52]";
    case "CANCELLED":
      return "bg-[#f6e6e6] text-[#8a4545]";
    default:
      return "bg-[#efe4da] text-[#7a6b5d]";
  }
}
