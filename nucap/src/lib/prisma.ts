import { PrismaClient } from '@prisma/client';

// Enhanced Prisma client with better error handling and configuration
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with specific configuration for Neon
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle connection errors gracefully
prisma.$connect().catch((error) => {
  console.error('Prisma connection error:', error);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;