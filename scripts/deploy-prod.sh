#!/bin/bash
# Builds and starts the production stack (docker-compose.prod.yml on top of
# docker-compose.yml), then syncs the database schema and seeds the default host.
#
# First run: creates .env.production from .env and replaces the dev secrets
# (JWT_SECRET, LiveKit key/secret) with random ones. Existing values are kept
# on later runs, so redeploying doesn't log everyone out.
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=".env.production"
COMPOSE=(docker compose --env-file "$ENV_FILE" -f docker-compose.yml -f docker-compose.prod.yml)

set_env() {
  local key="$1" value="$2"
  if grep -q "^$key=" "$ENV_FILE"; then
    sed -i "s|^$key=.*|$key=\"$value\"|" "$ENV_FILE"
  else
    echo "$key=\"$value\"" >> "$ENV_FILE"
  fi
}

if [ ! -f "$ENV_FILE" ]; then
  [ -f .env ] || { echo "No .env to start from. Create $ENV_FILE first."; exit 1; }
  echo "Creating $ENV_FILE from .env with fresh secrets..."
  cp .env "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  set_env JWT_SECRET "$(openssl rand -hex 32)"
  set_env LIVEKIT_API_KEY "API$(openssl rand -hex 6)"
  set_env LIVEKIT_API_SECRET "$(openssl rand -hex 32)"
fi

echo "Building and starting production containers..."
"${COMPOSE[@]}" up -d --build

echo "Waiting for the app container..."
for _ in $(seq 1 30); do
  "${COMPOSE[@]}" exec -T app true 2>/dev/null && break
  sleep 2
done

echo "Syncing database schema..."
"${COMPOSE[@]}" exec -T app npx prisma db push

echo "Seeding default host..."
"${COMPOSE[@]}" exec -T app npx prisma db seed

cat <<EOF

Production stack is up on http://localhost:3000
Logs:   ${COMPOSE[*]} logs -f app
Stop:   ${COMPOSE[*]} down
EOF
