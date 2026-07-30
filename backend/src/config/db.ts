import { prisma } from '../lib/prisma.js';

export function resolveDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;

  if (user && password && name) {
    return `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
  }

  return undefined;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export const connectDB = async (): Promise<boolean> => {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      'DATABASE_URL is missing. Set DATABASE_URL, or DB_USER + DB_PASSWORD + DB_NAME.'
    );
    return false;
  }

  // Ensure URL has a short connect timeout for Hostinger (avoid nginx 504)
  const separator = databaseUrl.includes('?') ? '&' : '?';
  const timedUrl = databaseUrl.includes('connect_timeout')
    ? databaseUrl
    : `${databaseUrl}${separator}connect_timeout=5`;

  process.env.DATABASE_URL = timedUrl;
  const safeHost = timedUrl.replace(/:[^:@/]+@/, ':****@');
  console.log(`Connecting to MySQL: ${safeHost}`);

  try {
    await withTimeout(prisma.$connect(), 8000, 'prisma.$connect');
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000, 'prisma ping');
    console.log('MySQL Connected via Prisma');
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    return false;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
