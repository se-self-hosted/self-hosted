#!/bin/bash
# Builds and starts the production stack (docker-compose.prod.yml on top of
# docker-compose.yml), then applies database migrations and seeds the default host.
#
# First run: creates .env.production from .env and replaces the dev secrets
# (JWT_SECRET, LiveKit key/secret) with random ones. Existing values are kept
# on later runs, so redeploying doesn't log everyone out.
#
# The prod stack reuses the dev stack's containers and volumes, so it replaces
# a running `docker compose up` (switch back with `docker compose up -d`).
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
  # .env may hold an old quick-tunnel URL; scripts/cloudflare-tunnel.sh
  # rewrites this when a public tunnel is started.
  set_env NEXT_PUBLIC_LIVEKIT_URL "ws://localhost:7880"
fi

echo "Building and starting production containers..."
"${COMPOSE[@]}" up -d --build --wait --wait-timeout 180

echo "Applying database migrations..."
if ! migrate_log="$("${COMPOSE[@]}" exec -T app npx prisma migrate deploy 2>&1)"; then
  echo "$migrate_log"
  # P3005: the schema was created with `prisma db push` (scripts/start-server.sh),
  # so there is no migration history to apply on top of.
  if grep -q P3005 <<<"$migrate_log"; then
    echo "Database has no migration history; syncing with prisma db push instead..."
    "${COMPOSE[@]}" exec -T app npx prisma db push
  else
    exit 1
  fi
else
  echo "$migrate_log" | tail -n 3
fi

echo "Seeding default host..."
"${COMPOSE[@]}" exec -T app npx prisma db seed

echo "Checking the app responds..."
status="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)"
[ "$status" = "200" ] || { echo "App answered HTTP $status on /"; exit 1; }

cat <<EOF2

Production stack is up on http://localhost:3000
Public URL: ENV_FILE=$ENV_FILE ./scripts/cloudflare-tunnel.sh
Logs:       ${COMPOSE[*]} logs -f app
Stop:       ${COMPOSE[*]} down
Back to dev: docker compose up -d
EOF2
