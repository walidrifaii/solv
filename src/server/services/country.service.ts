import { prisma } from "@/lib/db";

function mapCountry(country: {
  id: string;
  name: string;
  nameAr: string | null;
  iso2: string;
  dialCode: string;
  flagEmoji: string | null;
  sortOrder: number;
}) {
  return {
    id: country.id,
    name: country.name,
    nameAr: country.nameAr,
    iso2: country.iso2,
    dialCode: country.dialCode,
    flagEmoji: country.flagEmoji,
    sortOrder: country.sortOrder,
  };
}

export async function listCountries() {
  const rows = await prisma.country.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      nameAr: true,
      iso2: true,
      dialCode: true,
      flagEmoji: true,
      sortOrder: true,
    },
  });

  return rows.map(mapCountry);
}

export async function findCountryById(id: string) {
  return prisma.country.findFirst({
    where: { id: id.toLowerCase(), isActive: true },
  });
}

export async function findCountryByDialCode(dialCode: string) {
  const digits = dialCode.replace(/\D/g, "");
  return prisma.country.findFirst({
    where: { dialCode: digits, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
