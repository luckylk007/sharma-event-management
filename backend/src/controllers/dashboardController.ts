import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { serialize } from '../utils/serialize.js';

function normalizeTestimonialBody(body: Record<string, unknown>) {
  const data: Record<string, unknown> = { ...body };
  delete data._id;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
}

export const getDashboardStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      blogsCount,
      publishedBlogs,
      servicesCount,
      galleryCount,
      contactsCount,
      newContacts,
      testimonialsCount,
      subscribers,
      recentContacts,
      recentBlogs,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { isPublished: true } }),
      prisma.service.count({ where: { isPublished: true } }),
      prisma.galleryItem.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'new' } }),
      prisma.testimonial.count({ where: { isPublished: true } }),
      prisma.newsletter.count({ where: { isActive: true } }),
      prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.blog.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
          updatedAt: true,
          views: true,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        cards: {
          blogs: blogsCount,
          publishedBlogs,
          services: servicesCount,
          gallery: galleryCount,
          contacts: contactsCount,
          newContacts,
          testimonials: testimonialsCount,
          subscribers,
        },
        recentContacts: serialize(recentContacts),
        recentBlogs: serialize(recentBlogs),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonials = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const where: Prisma.TestimonialWhereInput = {};
    if (req.query.published !== 'all') where.isPublished = true;
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ success: true, data: serialize(testimonials) });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = normalizeTestimonialBody(req.body) as Prisma.TestimonialCreateInput;
    const testimonial = await prisma.testimonial.create({ data });
    res.status(201).json({ success: true, data: serialize(testimonial) });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) throw new AppError('Testimonial not found', 404);

    const data = normalizeTestimonialBody(req.body) as Prisma.TestimonialUpdateInput;
    const testimonial = await prisma.testimonial.update({
      where: { id: existing.id },
      data,
    });
    res.status(200).json({ success: true, data: serialize(testimonial) });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) throw new AppError('Testimonial not found', 404);
    await prisma.testimonial.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

export const subscribeNewsletter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) throw new AppError('Email is required', 400);

    const normalized = String(email).toLowerCase().trim();
    const existing = await prisma.newsletter.findUnique({ where: { email: normalized } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletter.update({
          where: { id: existing.id },
          data: { isActive: true },
        });
      }
      res.status(200).json({ success: true, message: 'You are already subscribed!' });
      return;
    }

    await prisma.newsletter.create({ data: { email: normalized } });
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { uploadToCloudinary } = await import('../utils/upload.js');
    if (!req.file) throw new AppError('No image uploaded', 400);
    const result = await uploadToCloudinary(req.file.buffer, 'sharma-events/uploads');
    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        alt: req.body.alt || '',
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSitemap = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    const [services, blogs] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const staticPages = [
      '',
      '/about',
      '/services',
      '/gallery',
      '/blog',
      '/contact',
      '/privacy-policy',
      '/terms-conditions',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${siteUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    }

    for (const s of services) {
      xml += `  <url>
    <loc>${siteUrl}/services/${s.slug}</loc>
    <lastmod>${s.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }

    for (const b of blogs) {
      xml += `  <url>
    <loc>${siteUrl}/blog/${b.slug}</loc>
    <lastmod>${b.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
};

export const getRobots = (_req: AuthRequest, res: Response): void => {
  const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`);
};
