#!/bin/sh
set -u

echo "[entrypoint] Bootstrapping database..."
if ! node /app/scripts/bootstrap-db.js; then
  echo "[entrypoint] WARNING: database bootstrap failed — starting app anyway."
fi

echo "[entrypoint] Starting Next.js..."
exec node /app/server.js
