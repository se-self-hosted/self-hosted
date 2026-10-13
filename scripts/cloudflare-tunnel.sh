#!/bin/bash
# Starts Cloudflare quick tunnels for the app (3000) and LiveKit (7880),
# prints the public URLs, and patches .env's NEXT_PUBLIC_LIVEKIT_URL so
# remote browsers can reach LiveKit's signaling websocket through the tunnel.
#
# Quick tunnels (`cloudflared tunnel --url ...`) need no login and get a
# random *.trycloudflare.com hostname every run -- fine for dev/demo, not
# for a stable production URL (use a named tunnel for that).
set -euo pipefail

cd "$(dirname "$0")/.."

APP_PORT="${APP_PORT:-3000}"
LIVEKIT_PORT="${LIVEKIT_PORT:-7880}"
ENV_FILE=".env"

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

echo "Starting tunnel for app (localhost:$APP_PORT)..."
cloudflared tunnel --url "http://localhost:$APP_PORT" --no-autoupdate > "$APP_LOG" 2>&1 &
APP_PID=$!

echo "Starting tunnel for LiveKit (localhost:$LIVEKIT_PORT)..."
cloudflared tunnel --url "http://localhost:$LIVEKIT_PORT" --no-autoupdate > "$LIVEKIT_LOG" 2>&1 &
LIVEKIT_PID=$!

APP_URL=$(wait_for_url "$APP_LOG") || { echo "Timed out waiting for app tunnel URL. Log:"; cat "$APP_LOG"; exit 1; }
LIVEKIT_URL=$(wait_for_url "$LIVEKIT_LOG") || { echo "Timed out waiting for LiveKit tunnel URL. Log:"; cat "$LIVEKIT_LOG"; exit 1; }
LIVEKIT_WS_URL="wss://${LIVEKIT_URL#https://}"

if [ -f "$ENV_FILE" ] && grep -q '^NEXT_PUBLIC_LIVEKIT_URL=' "$ENV_FILE"; then
  sed -i.bak "s|^NEXT_PUBLIC_LIVEKIT_URL=.*|NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_WS_URL|" "$ENV_FILE"
  rm -f "$ENV_FILE.bak"
else
  echo "NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_WS_URL" >> "$ENV_FILE"
fi

cat <<EOF

Tunnels up:
  App:      $APP_URL
  LiveKit:  $LIVEKIT_WS_URL   (written to $ENV_FILE as NEXT_PUBLIC_LIVEKIT_URL)

Restart the app to pick up the new env var (no rebuild needed; the server
reads it at runtime):
  docker compose restart app                          # development
  docker compose -f docker-compose.yml up -d app      # production (re-reads .env)

Press Ctrl+C to stop both tunnels.
EOF

wait
