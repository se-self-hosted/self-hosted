#!/bin/bash
# Starts Cloudflare quick tunnels for the app (3000) and LiveKit (7880),
# prints the public URLs, and patches .env's NEXT_PUBLIC_LIVEKIT_URL so
# remote browsers can reach LiveKit's signaling websocket through the tunnel.
# It then recreates the running app container with the compose files it was
# started with, so the app serves the new URL (a plain restart keeps the old
# env). If that stack is docker-compose.prod.yml, ENV_FILE defaults to
# .env.production; set ENV_FILE to override.
#
# When NEXT_PUBLIC_LIVEKIT_URL points at a hosted LiveKit (e.g. LiveKit
# Cloud, anything other than a quick tunnel or localhost), only the app is
# tunneled and that URL is left alone.
#
# Quick tunnels (`cloudflared tunnel --url ...`) need no login and get a
# random *.trycloudflare.com hostname every run -- fine for dev/demo, not
# for a stable production URL (use a named tunnel for that).
set -euo pipefail

cd "$(dirname "$0")/.."

APP_PORT="${APP_PORT:-3000}"
LIVEKIT_PORT="${LIVEKIT_PORT:-7880}"

# Compose files of this project's running app container, comma-separated.
APP_CONFIG_FILES=$(docker ps \
  --filter "label=com.docker.compose.project.working_dir=$PWD" \
  --filter "label=com.docker.compose.service=app" \
  --format '{{.Label "com.docker.compose.project.config_files"}}' 2>/dev/null | head -n1 || true)

if [ -z "${ENV_FILE:-}" ]; then
  case ",$APP_CONFIG_FILES," in
    *docker-compose.prod.yml,*) ENV_FILE=".env.production" ;;
    *) ENV_FILE=".env" ;;
  esac
fi

CURRENT_LIVEKIT_URL=$(grep -E '^NEXT_PUBLIC_LIVEKIT_URL=' "$ENV_FILE" 2>/dev/null | tail -n1 | cut -d= -f2- | tr -d '"' || true)
case "$CURRENT_LIVEKIT_URL" in
  "" | *trycloudflare.com* | *localhost* | *127.0.0.1*) TUNNEL_LIVEKIT=1 ;;
  *) TUNNEL_LIVEKIT=0 ;;
esac

APP_LOG="$(mktemp)"
LIVEKIT_LOG="$(mktemp)"
APP_PID=""
LIVEKIT_PID=""

cleanup() {
  echo
  echo "Stopping tunnels..."
  [ -n "$APP_PID" ] && kill "$APP_PID" 2>/dev/null || true
  [ -n "$LIVEKIT_PID" ] && kill "$LIVEKIT_PID" 2>/dev/null || true
  rm -f "$APP_LOG" "$LIVEKIT_LOG"
}
trap cleanup EXIT INT TERM

wait_for_url() {
  local log_file="$1"
  local tries=0
  while [ "$tries" -lt 60 ]; do
    url=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' "$log_file" | head -n1 || true)
    if [ -n "$url" ]; then
      echo "$url"
      return 0
    fi
    sleep 1
    tries=$((tries + 1))
  done
  return 1
}

# The app reads NEXT_PUBLIC_LIVEKIT_URL when its container is created, so
# `docker compose restart` would keep serving the old tunnel URL.
recreate_app() {
  if [ -z "$APP_CONFIG_FILES" ]; then
    echo "No app container is running; it will use the new URL when the stack starts."
    return 0
  fi
  local args=(--env-file "$ENV_FILE") files f
  IFS=',' read -ra files <<< "$APP_CONFIG_FILES"
  for f in "${files[@]}"; do args+=(-f "$f"); done
  echo "Recreating the app container so it serves the new LiveKit URL..."
  docker compose "${args[@]}" up -d --no-deps --no-build --force-recreate --wait app \
    || echo "⚠️  Recreating the app failed. Run: docker compose ${args[*]} up -d app"
}

echo "Starting tunnel for app (localhost:$APP_PORT)..."
cloudflared tunnel --url "http://localhost:$APP_PORT" --no-autoupdate > "$APP_LOG" 2>&1 &
APP_PID=$!

if [ "$TUNNEL_LIVEKIT" = 1 ]; then
  echo "Starting tunnel for LiveKit (localhost:$LIVEKIT_PORT)..."
  cloudflared tunnel --url "http://localhost:$LIVEKIT_PORT" --no-autoupdate > "$LIVEKIT_LOG" 2>&1 &
  LIVEKIT_PID=$!
fi

APP_URL=$(wait_for_url "$APP_LOG") || { echo "Timed out waiting for app tunnel URL. Log:"; cat "$APP_LOG"; exit 1; }

if [ "$TUNNEL_LIVEKIT" = 1 ]; then
  LIVEKIT_URL=$(wait_for_url "$LIVEKIT_LOG") || { echo "Timed out waiting for LiveKit tunnel URL. Log:"; cat "$LIVEKIT_LOG"; exit 1; }
  LIVEKIT_WS_URL="wss://${LIVEKIT_URL#https://}"

  if [ -f "$ENV_FILE" ] && grep -q '^NEXT_PUBLIC_LIVEKIT_URL=' "$ENV_FILE"; then
    sed -i.bak "s|^NEXT_PUBLIC_LIVEKIT_URL=.*|NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_WS_URL|" "$ENV_FILE"
    rm -f "$ENV_FILE.bak"
  else
    echo "NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_WS_URL" >> "$ENV_FILE"
  fi

  recreate_app
  LIVEKIT_NOTE="$LIVEKIT_WS_URL   (written to $ENV_FILE as NEXT_PUBLIC_LIVEKIT_URL)"
else
  LIVEKIT_NOTE="$CURRENT_LIVEKIT_URL   (hosted, from $ENV_FILE; not tunneled)"
fi

cat <<EOF

Tunnels up:
  App:      $APP_URL
  LiveKit:  $LIVEKIT_NOTE

Press Ctrl+C to stop the tunnels.
EOF

wait
