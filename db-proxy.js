// Exposes Prisma Studio (bound to localhost:5555 inside the container) on 0.0.0.0:5556
// so docker-compose can publish it to the host as 5555:5556.
const net = require("net");

const LISTEN_PORT = Number(process.env.DB_PROXY_PORT || 5556);
const TARGET_HOST = process.env.DB_PROXY_TARGET_HOST || "localhost";
const TARGET_PORT = Number(process.env.DB_PROXY_TARGET_PORT || 5555);

const server = net.createServer((client) => {
  const upstream = net.connect({ host: TARGET_HOST, port: TARGET_PORT });

  client.pipe(upstream);
  upstream.pipe(client);

  const close = () => {
    client.destroy();
    upstream.destroy();
  };
  client.on("error", close);
  upstream.on("error", (err) => {
    if (err.code !== "ECONNREFUSED") console.error("[db-proxy]", err.message);
    close();
  });
});

server.listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`[db-proxy] 0.0.0.0:${LISTEN_PORT} -> ${TARGET_HOST}:${TARGET_PORT}`);
});
