import { PrismaClient } from "../src/generated/prisma";
import { qatarCities } from "./data/qatar-cities";

const prisma = new PrismaClient();

async function main() {
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

  console.log(`Seeded ${qatarCities.length} Qatar cities.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
