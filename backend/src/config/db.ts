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

export const connectDB = async (): Promise<boolean> => {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      'DATABASE_URL is missing. Set DATABASE_URL, or DB_USER + DB_PASSWORD + DB_NAME.'
    );
    return false;
  }

  process.env.DATABASE_URL = databaseUrl;
  const safeHost = databaseUrl.replace(/:[^:@/]+@/, ':****@');
  console.log(`Connecting to MySQL: ${safeHost}`);

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log('MySQL Connected via Prisma');
      return true;
    } catch (error) {
      console.error(`MySQL connection attempt ${attempt}/${maxAttempts} failed:`, error);
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }

  console.error(
    'MySQL still unreachable after retries. Server will start anyway so Hostinger does not show 503; API routes that need DB will fail until credentials/host are fixed.'
  );
  return false;
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
