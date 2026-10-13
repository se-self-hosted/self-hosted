import fs from "fs";
import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getConnectionString(): string {
  let url = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/meeting_db?schema=public";
  const isDocker = fs.existsSync("/.dockerenv");
  if (!isDocker && url.includes("@postgres:")) {
    url = url.replace("@postgres:", "@localhost:");
  }
  return url;
}

function envInt(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

// pg defaults to 10 connections and waits forever for a free one, so a burst
// of joins holding the room lock could stall every other request. Fail fast
// instead, and cap any one statement so a stuck query can't pin a connection.
const pool = globalForPrisma.pool ?? new Pool({
  connectionString: getConnectionString(),
  max: envInt("DATABASE_POOL_MAX", 20),
  connectionTimeoutMillis: envInt("DATABASE_POOL_TIMEOUT_MS", 10_000),
  idleTimeoutMillis: 30_000,
  statement_timeout: envInt("DATABASE_STATEMENT_TIMEOUT_MS", 30_000),
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.PRISMA_LOG_QUERIES === "true" ? ["query", "error", "warn"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
