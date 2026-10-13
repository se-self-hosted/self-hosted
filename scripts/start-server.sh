#!/bin/bash
# Development stack: next dev with hot reload, plus Prisma Studio.
# (Production: scripts/start-production.sh)
set -euo pipefail
cd "$(dirname "$0")/.."

# --renew-anon-volumes: the container's node_modules lives in an anonymous
# volume, which would otherwise keep old packages after a dependency change.
# The migrate service pushes the schema and seeds the default user first.
echo "🚀 Building and starting the development stack..."
docker compose up -d --build --renew-anon-volumes --wait

echo "✅ Server is fully running!"
echo "👉 App: http://localhost:3000"
echo "👉 Prisma Studio: http://localhost:5555"
