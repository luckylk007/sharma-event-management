#!/usr/bin/env node
/**
 * Ensures DATABASE_URL exists for Prisma CLI (migrate) when only DB_* vars are set.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }

  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;

  if (!user || !password || !name) {
    console.error('Missing DATABASE_URL or DB_USER/DB_PASSWORD/DB_NAME');
    process.exit(1);
  }

  return `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

process.env.DATABASE_URL = buildDatabaseUrl();

console.log('[start] Running prisma migrate deploy...');
const migrate = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['prisma', 'migrate', 'deploy'],
  {
    cwd: path.join(root, 'backend'),
    env: process.env,
    stdio: 'inherit',
  }
);

if (migrate.status !== 0) {
  console.error('[start] prisma migrate deploy failed — trying db push...');
  const push = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['prisma', 'db', 'push'],
    {
      cwd: path.join(root, 'backend'),
      env: process.env,
      stdio: 'inherit',
    }
  );
  if (push.status !== 0) {
    console.error('[start] Database schema sync failed');
    process.exit(push.status || 1);
  }
}

console.log('[start] Starting server...');
const server = spawnSync(process.execPath, [path.join(root, 'server.js')], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

process.exit(server.status ?? 1);
