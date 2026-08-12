#!/usr/bin/env sh
set -eu

# Applies schema + seeds cities/countries. Used by Docker entrypoint / Easypanel.
# Prefer: container start runs this automatically via scripts/docker-entrypoint.sh

node scripts/bootstrap-db.js
