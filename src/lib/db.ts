import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

import fs from "fs";

function getConnectionString(): string {
  let url = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/meeting_db?schema=public";
  const isDocker = fs.existsSync("/.dockerenv");
  if (!isDocker && url.includes("@postgres:")) {
    url = url.replace("@postgres:", "@localhost:");
  }
  return url;
}

const pool = globalForPrisma.pool ?? new Pool({ connectionString: getConnectionString() });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
