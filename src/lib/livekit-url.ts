/**
 * The LiveKit URL browsers connect to, read when each request runs.
 *
 * Next inlines `process.env.NEXT_PUBLIC_*` into the build, server code
 * included, so a production image would keep whatever URL it was built with.
 * A dynamic lookup isn't inlined: scripts/cloudflare-tunnel.sh can point the
 * running app at a new tunnel with a restart instead of a rebuild.
 */
export function publicLivekitUrl(): string {
  const name = "NEXT_PUBLIC_LIVEKIT_URL";
  return process.env[name] || "ws://localhost:7880";
}
