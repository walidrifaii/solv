#!/bin/sh
set -eu

echo "[entrypoint] Bootstrapping database..."
node /app/scripts/bootstrap-db.js

echo "[entrypoint] Starting Next.js..."
exec node /app/server.js
