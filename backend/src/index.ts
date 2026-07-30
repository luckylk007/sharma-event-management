import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { prisma } from './lib/prisma.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import {
  getSitemap,
  getRobots,
} from './controllers/dashboardController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const hasFrontend = fs.existsSync(path.join(frontendDist, 'index.html'));
const isProd = process.env.NODE_ENV === 'production' || hasFrontend;
const clientUrl = process.env.CLIENT_URL || process.env.SITE_URL || 'http://localhost:5173';

if (!process.env.NODE_ENV && hasFrontend) {
  process.env.NODE_ENV = 'production';
}

configureCloudinary();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(
  cors({
    origin: isProd
      ? ([clientUrl, process.env.SITE_URL, 'https://sharma.lacebylennox.in'].filter(Boolean) as string[])
      : clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(isProd ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

app.get('/api/health', async (_req, res) => {
  let database: 'up' | 'down' = 'down';
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('db ping timeout')), 2000)),
    ]);
    database = 'up';
  } catch {
    database = 'down';
  }

  res.status(200).json({
    success: true,
    message: 'Sharma Events API is running',
    database,
    frontend: hasFrontend ? 'found' : 'missing',
    nodeEnv: process.env.NODE_ENV || null,
    timestamp: new Date(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api', dashboardRoutes);

app.get('/sitemap.xml', getSitemap);
app.get('/robots.txt', getRobots);

if (hasFrontend) {
  console.log(`[boot] Serving frontend from ${frontendDist}`);
  app.use(express.static(frontendDist, { index: false, maxAge: '7d' }));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path === '/sitemap.xml' || req.path === '/robots.txt') return next();
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  console.warn(`[boot] frontend/dist/index.html not found at ${frontendDist}`);
}

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    connectDB()
      .then((dbOk) => {
        console.log(`Database status: ${dbOk ? 'connected' : 'NOT connected'}`);
      })
      .catch((error) => {
        console.error('Background DB connect error:', error);
      });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
