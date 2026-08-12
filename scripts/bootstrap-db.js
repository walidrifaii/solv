#!/usr/bin/env node
/**
 * Production bootstrap: apply Prisma schema + seed cities/countries.
 * Safe to run on every container start (upserts only).
 * Exits non-zero only when schema push fails hard.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function log(message) {
  console.log(`[bootstrap-db] ${message}`);
}

function warn(message, error) {
  console.error(`[bootstrap-db] WARNING: ${message}`);
  if (error) console.error(error);
}

function fail(message, error) {
  console.error(`[bootstrap-db] ${message}`);
  if (error) console.error(error);
  process.exit(1);
}

function resolvePrismaBin() {
  const candidates = [
    path.join(process.cwd(), "node_modules", "prisma", "build", "index.js"),
    path.join(process.cwd(), "node_modules", "prisma", "build", "index.mjs"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function runPrismaPush() {
  const prismaBin = resolvePrismaBin();
  const args = ["db", "push", "--skip-generate", "--accept-data-loss"];

  log("Applying database schema (prisma db push)...");

  let result;
  if (prismaBin) {
    result = spawnSync(process.execPath, [prismaBin, ...args], {
      stdio: "inherit",
      env: process.env,
    });
  } else {
    warn("prisma CLI not found in image — skipping db push");
    return false;
  }

  if (result.status !== 0) {
    fail("prisma db push failed");
  }
  log("Schema is up to date.");
  return true;
}

async function seed() {
  const clientPath = path.join(
    process.cwd(),
    "src",
    "generated",
    "prisma",
  );
  if (!fs.existsSync(path.join(clientPath, "index.js"))) {
    warn(`Prisma client missing at ${clientPath} — skipping seed`);
    return;
  }

  const { PrismaClient } = require(clientPath);
  const prisma = new PrismaClient();

  try {
    const citiesPath = path.join(
      process.cwd(),
      "prisma",
      "data",
      "qatar-cities.json",
    );
    const countriesPath = path.join(
      process.cwd(),
      "prisma",
      "data",
      "countries.json",
    );

    if (fs.existsSync(citiesPath)) {
      const cities = JSON.parse(fs.readFileSync(citiesPath, "utf8"));
      for (const city of cities) {
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
      log(`Seeded ${cities.length} cities.`);
    } else {
      log("cities JSON missing — skipped.");
    }

    if (fs.existsSync(countriesPath)) {
      const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8"));
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
      log(`Seeded ${countries.length} countries.`);
    } else {
      log("countries JSON missing — skipped.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL is required");
  }

  runPrismaPush();
  try {
    await seed();
  } catch (error) {
    warn("seed failed — continuing", error);
  }
  log("Database bootstrap complete.");
}

main().catch((error) => fail("bootstrap failed", error));
