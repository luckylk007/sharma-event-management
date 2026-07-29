import { prisma } from '../lib/prisma.js';

export const connectDB = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('MySQL Connected via Prisma');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
