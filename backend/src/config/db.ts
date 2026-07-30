import { prisma } from '../lib/prisma.js';

function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;

  if (user && password && name) {
    const encodedPassword = encodeURIComponent(password);
    return `mysql://${user}:${encodedPassword}@${host}:${port}/${name}`;
  }

  return undefined;
}

export const connectDB = async (): Promise<void> => {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      'DATABASE_URL is missing. Set DATABASE_URL, or DB_USER + DB_PASSWORD + DB_NAME in environment variables.'
    );
    process.exit(1);
  }

  // Prisma reads DATABASE_URL from env
  process.env.DATABASE_URL = databaseUrl;

  try {
    const safeHost = databaseUrl.replace(/:[^:@/]+@/, ':****@');
    console.log(`Connecting to MySQL: ${safeHost}`);
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('MySQL Connected via Prisma');
  } catch (error) {
    console.error('MySQL connection error:', error);
    console.error(
      'Check Hostinger MySQL credentials. Prefer DB_USER / DB_PASSWORD / DB_NAME if the password has special characters.'
    );
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
