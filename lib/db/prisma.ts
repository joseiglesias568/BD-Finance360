import { PrismaClient } from '@prisma/client'

// Resolve DATABASE_URL from multiple possible env var names.
// Vercel Neon integration may store the URL under a prefixed name (e.g. AEE_STORAGE_DATABASE_URL).
// Set DATABASE_URL before PrismaClient initializes so schema.prisma env("DATABASE_URL") resolves.
if (!process.env.DATABASE_URL) {
  const fallback =
    process.env.AEE_STORAGE_DATABASE_URL ||
    process.env.AMEREN_STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (fallback) {
    process.env.DATABASE_URL = fallback;
  }
}

// Singleton pattern for Next.js (prevents multiple clients in dev mode)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
