export function getIceServers() {
  const user = process.env.TURN_USER || "meetuser";
  const password = process.env.TURN_PASSWORD || "meetsync-turn-secret";
  const domain = process.env.TURN_DOMAIN || "localhost";

  return [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: `stun:${domain}:3478` },
    {
      urls: `turn:${domain}:3478`,
      username: user,
      credential: password,
    },
  ];
}
