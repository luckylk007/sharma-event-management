import { prisma } from '../lib/prisma.js';

function buildUrl(parts: {
  user: string;
  password: string;
  host: string;
  port: string;
  name: string;
}): string {
  const encodedPassword = encodeURIComponent(parts.password);
  return `mysql://${parts.user}:${encodedPassword}@${parts.host}:${parts.port}/${parts.name}?connect_timeout=5`;
}

export function resolveDatabaseUrl(): string | undefined {
  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || '127.0.0.1';

  // Prefer discrete DB_* vars (avoids broken URL-encoding of special password chars)
  if (user && password && name) {
    return buildUrl({ user, password, host, port, name });
  }

  if (process.env.DATABASE_URL?.trim()) {
    const url = process.env.DATABASE_URL.trim();
    // Force TCP-friendly host if someone used localhost (Prisma/TCP issue on Hostinger)
    return url
      .replace('@localhost:', '@127.0.0.1:')
      .replace(/(\?|&)connect_timeout=\d+/, '')
      .concat(url.includes('?') ? '&connect_timeout=5' : '?connect_timeout=5');
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

async function tryConnect(url: string): Promise<boolean> {
  process.env.DATABASE_URL = url;
  const safeHost = url.replace(/:[^:@/]+@/, ':****@');
  console.log(`Trying MySQL: ${safeHost}`);

  // Recreate is not needed — Prisma reads env on query; disconnect first to clear bad state
  try {
    await prisma.$disconnect().catch(() => undefined);
    await withTimeout(prisma.$connect(), 8000, 'prisma.$connect');
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000, 'prisma ping');
    console.log('MySQL Connected via Prisma');
    return true;
  } catch (error) {
    console.error('MySQL attempt failed:', error);
    return false;
  }
}

export const connectDB = async (): Promise<boolean> => {
  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  const preferredHost = process.env.DB_HOST || process.env.MYSQL_HOST;

  const hostsToTry = [
    preferredHost,
    '127.0.0.1',
    'localhost',
  ].filter((h, i, arr): h is string => Boolean(h) && arr.indexOf(h) === i);

  if (user && password && name) {
    for (const host of hostsToTry) {
      const url = buildUrl({ user, password, host, port, name });
      if (await tryConnect(url)) return true;
    }
  } else {
    const url = resolveDatabaseUrl();
    if (!url) {
      console.error('DATABASE_URL / DB_* missing');
      return false;
    }
    if (await tryConnect(url)) return true;
  }

  console.error(
    'MySQL still down. On Hostinger: set DB_HOST=127.0.0.1 (not localhost), confirm DB user/password/name, or use Remote MySQL hostname from hPanel.'
  );
  return false;
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
