import { PrismaClient } from "../src/generated/prisma";
import { countries } from "./data/countries";

const prisma = new PrismaClient();

async function main() {
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

  console.log(`Seeded ${countries.length} countries.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
