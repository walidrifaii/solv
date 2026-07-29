import { prisma } from "@/lib/db";

function mapCity(city: {
  id: string;
  name: string;
  nameAr: string | null;
  sortOrder: number;
}) {
  return {
    id: city.id,
    name: city.name,
    nameAr: city.nameAr,
    sortOrder: city.sortOrder,
  };
}

export async function listCities() {
  const rows = await prisma.city.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      nameAr: true,
      sortOrder: true,
    },
  });

  return rows.map(mapCity);
}
