
// Prisma configuration for Neon PostgreSQL on Vercel
// DATABASE_URL         = pooled connection (pgbouncer=true) — used at runtime
// DATABASE_URL_UNPOOLED = direct connection — used for prisma migrate/deploy
//
// Priority: UNPOOLED → DATABASE_URL → empty string (generate-only CI runs
// do not connect to the DB so a missing URL is acceptable at generate time).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
