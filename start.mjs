#!/usr/bin/env node
/**
 * Hostinger start entry:
 * 1) Build DATABASE_URL from DB_* if needed
 * 2) Best-effort schema sync (never block boot on failure)
 * 3) Always start the Express server
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const backendDir = path.join(root, 'backend');

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
    return null;
  }

  return `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

const databaseUrl = buildDatabaseUrl();
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
  console.log('[start] DATABASE_URL ready');
} else {
  console.warn('[start] DATABASE_URL / DB_* not set — server will still start and log DB errors');
}

function runPrisma(args) {
  const localBin = path.join(backendDir, 'node_modules', 'prisma', 'build', 'index.js');
  if (fs.existsSync(localBin)) {
    return spawnSync(process.execPath, [localBin, ...args], {
      cwd: backendDir,
      env: process.env,
      stdio: 'inherit',
    });
  }

  return spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['prisma', ...args], {
    cwd: backendDir,
    env: process.env,
    stdio: 'inherit',
  });
}

if (process.env.DATABASE_URL) {
  console.log('[start] Running prisma migrate deploy (best effort)...');
  const migrate = runPrisma(['migrate', 'deploy']);
  if (migrate.status !== 0) {
    console.warn('[start] migrate deploy failed — trying db push (best effort)...');
    const push = runPrisma(['db', 'push', '--accept-data-loss=false']);
    if (push.status !== 0) {
      console.warn('[start] schema sync failed — continuing to start server anyway');
    }
  }
}

const entry = path.join(backendDir, 'dist', 'index.js');
if (!fs.existsSync(entry)) {
  console.error('[start] Missing backend/dist/index.js — build did not produce the backend');
  process.exit(1);
}

console.log('[start] Starting Express on PORT=', process.env.PORT || '5000');
const server = spawnSync(process.execPath, [entry], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

process.exit(server.status ?? 1);
