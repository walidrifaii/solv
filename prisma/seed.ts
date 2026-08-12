import { DiscountType, PrismaClient } from "../src/generated/prisma";
import productsJson from "../src/data/products.json";
import { countries } from "./data/countries";
import { qatarCities } from "./data/qatar-cities";
import { hashPassword } from "../src/server/auth/password";

const prisma = new PrismaClient();

const categories = [
  {
    id: "coffee-beans",
    slug: "coffee-beans",
    name: "Coffee Beans",
    imagePath: "/assets/category-coffee-beans.png",
    sortOrder: 1,
  },
  {
    id: "ground-coffee",
    slug: "ground-coffee",
    name: "Ground Coffee",
    imagePath: "/assets/category-ground-coffee.png",
    sortOrder: 2,
  },
  {
    id: "tea",
    slug: "tea",
    name: "Tea",
    imagePath: "/assets/category-tea.png",
    sortOrder: 3,
  },
  {
    id: "tea-bags",
    slug: "tea-bags",
    name: "Tea Bags",
    imagePath: "/assets/category-tea-bags.png",
    sortOrder: 4,
  },
  {
    id: "accessories",
    slug: "accessories",
    name: "Accessories",
    imagePath: "/assets/category-accessories.png",
    sortOrder: 5,
  },
  {
    id: "gift-sets",
    slug: "gift-sets",
    name: "Gift Sets",
    imagePath: "/assets/category-gift-sets.png",
    sortOrder: 6,
  },
] as const;

const imagePathById: Record<string, string> = {
  "arabica-beans": "/assets/product-arabica-beans.png",
  "house-blend": "/assets/product-house-blend.png",
  "espresso-blend": "/assets/deal-espresso.png",
  "classic-roast": "/assets/product-classic-roast.png",
  "green-tea": "/assets/product-green-tea.png",
  "english-breakfast": "/assets/deal-tea.png",
  "evening-tea": "/assets/product-evening-tea.png",
  "elegant-teapot": "/assets/product-teapot.png",
  "coffee-gift-set": "/assets/deal-gift.png",
};

const featuredIds = new Set([
  "arabica-beans",
  "house-blend",
  "classic-roast",
  "green-tea",
  "evening-tea",
  "elegant-teapot",
]);

const percentageDiscountById: Record<string, number> = {
  "espresso-blend": 20,
  "english-breakfast": 15,
  "coffee-gift-set": 25,
};

const heroSlides = [
  {
    id: "rich-flavor",
    eyebrow: "Premium Coffee & Tea",
    eyebrowAr: "قهوة وشاي فاخر",
    title: "Rich Flavor, Perfect Moments",
    titleAr: "نكهة غنية، لحظات مثالية",
    description:
      "Discover our exclusive selection of premium coffee and tea blends, crafted for true taste lovers.",
    descriptionAr:
      "اكتشف مجموعتنا الحصرية من خلطات القهوة والشاي الفاخرة، المصممة لعشاق المذاق الأصيل.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Black coffee cup with steam, beans, and a gold cezve",
    imageAltAr: "فنجان قهوة سوداء مع بخار وحبوب وجذوة ذهبية",
    imagePath: "/assets/hero-1.png",
    href: "/products",
    sortOrder: 1,
  },
  {
    id: "latte-art",
    eyebrow: "Handcrafted Brews",
    eyebrowAr: "مشروبات حرفية",
    title: "Slow Sips, Golden Rituals",
    titleAr: "رشفات هادئة، طقوس ذهبية",
    description:
      "From silky espresso to delicate latte art, every cup is roasted and poured for depth, aroma, and calm.",
    descriptionAr:
      "من الإسبريسو الحريري إلى فن اللاتيه الرقيق، كل فنجان محمّص ومصبوب للعمق والرائحة والهدوء.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Latte art in a black cup with coffee beans and gold spoon",
    imageAltAr: "فن لاتيه في فنجان أسود مع حبوب قهوة وملعقة ذهبية",
    imagePath: "/assets/hero-2.png",
    href: "/products",
    sortOrder: 2,
  },
  {
    id: "tea-moments",
    eyebrow: "Tea & Warmth",
    eyebrowAr: "شاي ودفء",
    title: "Leaves, Steam, Quiet Luxury",
    titleAr: "أوراق، بخار، فخامة هادئة",
    description:
      "Explore refined tea blends and brewing rituals designed for evenings that linger a little longer.",
    descriptionAr:
      "استكشف خلطات شاي راقية وطقوس تحضير مصممة لأمسيات تدوم قليلاً أطول.",
    ctaLabel: "Shop Now",
    ctaLabelAr: "تسوق الآن",
    imageAlt: "Black teapot and teacup with steam and dried tea leaves",
    imageAltAr: "إبريق شاي أسود وفنجان مع بخار وأوراق شاي مجففة",
    imagePath: "/assets/hero-3.png",
    href: "/products",
    sortOrder: 3,
  },
] as const;

async function main() {
  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: slide.id },
      update: { ...slide, isActive: true },
      create: { ...slide, isActive: true },
    });
  }

  for (const city of qatarCities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {
        name: city.name,
        nameAr: city.nameAr,
        sortOrder: city.sortOrder,
        isActive: true,
      },
      create: {
        id: city.id,
        name: city.name,
        nameAr: city.nameAr,
        sortOrder: city.sortOrder,
        isActive: true,
      },
    });
  }

  for (const country of countries) {
    await prisma.country.upsert({
      where: { id: country.id },
      update: {
        name: country.name,
        nameAr: country.nameAr,
        iso2: country.iso2,
        dialCode: country.dialCode,
        flagEmoji: country.flagEmoji,
        sortOrder: country.sortOrder,
        isActive: true,
      },
      create: {
        id: country.id,
        name: country.name,
        nameAr: country.nameAr,
        iso2: country.iso2,
        dialCode: country.dialCode,
        flagEmoji: country.flagEmoji,
        sortOrder: country.sortOrder,
        isActive: true,
      },
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        slug: category.slug,
        name: category.name,
        imagePath: category.imagePath,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        imagePath: category.imagePath,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
  }

  for (const [index, item] of productsJson.entries()) {
    const percent = percentageDiscountById[item.id];
    const basePrice = item.originalPrice ?? item.price;

    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        slug: item.slug,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: basePrice,
        discountType: percent != null ? DiscountType.PERCENTAGE : null,
        discount: percent != null ? percent : null,
        imagePath: imagePathById[item.id] ?? `/assets/${item.id}.png`,
        quantity: 50,
        inStock: true,
        isFeatured: featuredIds.has(item.id),
        isActive: true,
        sortOrder: index + 1,
      },
      create: {
        id: item.id,
        slug: item.slug,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: basePrice,
        discountType: percent != null ? DiscountType.PERCENTAGE : null,
        discount: percent != null ? percent : null,
        imagePath: imagePathById[item.id] ?? `/assets/${item.id}.png`,
        quantity: 50,
        inStock: true,
        isFeatured: featuredIds.has(item.id),
        isActive: true,
        sortOrder: index + 1,
      },
    });
  }

  console.log(
    `Seeded ${heroSlides.length} hero slides, ${qatarCities.length} cities, ${countries.length} countries, ${categories.length} categories and ${productsJson.length} products.`,
  );

  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@solv.qa"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const adminName = process.env.ADMIN_NAME ?? "Solv Admin";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash: await hashPassword(adminPassword),
        isActive: true,
      },
    });
    console.log(`Seeded admin ${adminEmail} (default password from env/seed).`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
