#!/usr/bin/env sh
set -eu

# Creates/updates all Prisma tables (including cities) and seeds Qatar cities.
# Run once after deploy or whenever the schema/cities list changes.
#
# Usage (Easypanel / SSH on server):
#   DATABASE_URL="mysql://..." npm run db:deploy
#
# Cities only (table must already exist):
#   DATABASE_URL="mysql://..." npm run db:seed:cities

npm run db:deploy
