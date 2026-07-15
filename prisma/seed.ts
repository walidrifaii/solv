import { DiscountType, PrismaClient } from "@prisma/client";
import productsJson from "../src/data/products.json";

const prisma = new PrismaClient();

const categories = [
  { id: "coffee-beans", slug: "coffee-beans", name: "Coffee Beans", sortOrder: 1 },
  { id: "ground-coffee", slug: "ground-coffee", name: "Ground Coffee", sortOrder: 2 },
  { id: "tea", slug: "tea", name: "Tea", sortOrder: 3 },
  { id: "tea-bags", slug: "tea-bags", name: "Tea Bags", sortOrder: 4 },
  { id: "accessories", slug: "accessories", name: "Accessories", sortOrder: 5 },
  { id: "gift-sets", slug: "gift-sets", name: "Gift Sets", sortOrder: 6 },
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

/** percentage discounts for known deal products */
const percentageDiscountById: Record<string, number> = {
  "espresso-blend": 20,
  "english-breakfast": 15,
  "coffee-gift-set": 25,
};

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        id: category.id,
        slug: category.slug,
        name: category.name,
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
    `Seeded ${categories.length} categories and ${productsJson.length} products.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
