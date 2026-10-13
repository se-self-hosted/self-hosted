#!/bin/bash
# Production stack: optimized build served by the standalone Next.js server,
# running as a non-root user. Uses docker-compose.yml only (no dev override).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "🚀 Building and starting the production stack..."
docker compose -f docker-compose.yml up -d --build --wait

echo "✅ Production server is running: http://localhost:3000"
