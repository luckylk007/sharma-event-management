#!/usr/bin/env node
/**
 * Fast Hostinger start — do NOT block on migrate (that caused nginx 504).
 * Schema sync is best-effort and time-boxed; server always boots.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);
const backendDir = path.join(root, 'backend');
const entry = path.join(backendDir, 'dist', 'index.js');

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) return process.env.DATABASE_URL.trim();

  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || '3306';
  const name = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  if (!user || !password || !name) return null;
  return `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

const databaseUrl = buildDatabaseUrl();
if (databaseUrl) {
  const sep = databaseUrl.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = databaseUrl.includes('connect_timeout')
    ? databaseUrl
    : `${databaseUrl}${sep}connect_timeout=5`;
  console.log('[start] DATABASE_URL ready');
} else {
  console.warn('[start] DATABASE_URL / DB_* not set');
}

if (!fs.existsSync(entry)) {
  console.error('[start] Missing backend/dist/index.js — rebuild required');
  process.exit(1);
}

// Best-effort migrate with a hard timeout so we never delay boot
if (process.env.DATABASE_URL) {
  const prismaBin = path.join(backendDir, 'node_modules', 'prisma', 'build', 'index.js');
  if (fs.existsSync(prismaBin)) {
    console.log('[start] Quick migrate attempt (8s max)...');
    const migrate = spawnSync(process.execPath, [prismaBin, 'migrate', 'deploy'], {
      cwd: backendDir,
      env: process.env,
      stdio: 'inherit',
      timeout: 8000,
    });
    if (migrate.error || migrate.status !== 0) {
      console.warn('[start] migrate skipped/failed — run manually later: cd backend && npx prisma db push');
    }
  }
}

console.log('[start] Booting Express immediately on PORT=', process.env.PORT || '5000');
const child = spawn(process.execPath, [entry], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  console.error('[start] server exited', { code, signal });
  process.exit(code ?? 1);
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
