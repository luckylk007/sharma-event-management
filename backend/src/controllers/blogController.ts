import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { createSlug, calculateReadingTime } from '../utils/helpers.js';
import { asStringArray, serialize } from '../utils/serialize.js';

type BlogRow = Awaited<ReturnType<typeof prisma.blog.findFirst>>;

const relatedPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  readingTime: true,
  publishedAt: true,
  category: true,
} as const;

async function hydrateRelatedPosts(blog: NonNullable<BlogRow>) {
  const ids = asStringArray(blog.relatedPostIds);
  const related = ids.length
    ? await prisma.blog.findMany({
        where: { id: { in: ids } },
        select: relatedPostSelect,
      })
    : [];
  const byId = new Map(related.map((b) => [b.id, b]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  const { relatedPostIds: _omit, ...rest } = blog;
  return serialize({ ...rest, relatedPosts: ordered });
}

function normalizeBlogBody(body: Record<string, unknown>) {
  const data: Record<string, unknown> = { ...body };
  delete data._id;
  delete data.id;
  delete data.relatedPosts;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.views;

  if (data.relatedPostIds === undefined && Array.isArray(body.relatedPosts)) {
    data.relatedPostIds = (body.relatedPosts as Array<string | { _id?: string; id?: string }>)
      .map((item) => (typeof item === 'string' ? item : item._id || item.id || ''))
      .filter(Boolean);
  }

  if (!data.relatedPostIds) data.relatedPostIds = [];
  if (!data.tags) data.tags = [];
  if (!data.faqs) data.faqs = [];

  return data;
}

export const getBlogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 9);
    const skip = (page - 1) * limit;

    const where: Prisma.BlogWhereInput = {};
    if (req.query.published !== 'all') {
      where.isPublished = true;
    }
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.featured === 'true') where.isFeatured = true;
    if (req.query.tag) {
      // MySQL: match tag inside JSON string array via JSON_CONTAINS
      const tagged = await prisma.$queryRawUnsafe<{ id: string }[]>(
        'SELECT id FROM blogs WHERE JSON_CONTAINS(tags, ?)',
        JSON.stringify(String(req.query.tag))
      );
      where.id = { in: tagged.map((row) => row.id) };
    }
    if (req.query.search) {
      const q = String(req.query.search);
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          tags: true,
          author: true,
          readingTime: true,
          views: true,
          isFeatured: true,
          isPublished: true,
          publishedAt: true,
          faqs: true,
          seo: true,
          relatedPostIds: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: serialize(blogs),
    });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    let current = blog;
    if (blog.isPublished) {
      current = await prisma.blog.update({
        where: { id: blog.id },
        data: { views: { increment: 1 } },
      });
    }

    res.status(200).json({ success: true, data: await hydrateRelatedPosts(current) });
  } catch (error) {
    next(error);
  }
};

export const getBlogSidebar = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [latest, popular, published] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          publishedAt: true,
          readingTime: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          views: true,
          readingTime: true,
        },
        orderBy: { views: 'desc' },
        take: 5,
      }),
      prisma.blog.findMany({
        where: { isPublished: true },
        select: { category: true, tags: true },
      }),
    ]);

    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();

    for (const post of published) {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
      for (const tag of asStringArray(post.tags)) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }

    const categories = [...categoryMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const tags = [...tagMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    res.status(200).json({
      success: true,
      data: {
        latest: serialize(latest),
        popular: serialize(popular),
        categories,
        tags,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = createSlug(req.body.title);
    }
    if (req.body.content) {
      req.body.readingTime = calculateReadingTime(req.body.content);
    }
    if (req.body.isPublished && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const data = normalizeBlogBody(req.body) as Prisma.BlogCreateInput;
    const blog = await prisma.blog.create({ data });
    res.status(201).json({ success: true, data: await hydrateRelatedPosts(blog) });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = createSlug(req.body.title);
    }
    if (req.body.content) {
      req.body.readingTime = calculateReadingTime(req.body.content);
    }

    const existing = await prisma.blog.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Blog not found', 404);
    }

    if (req.body.isPublished && !existing.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const data = normalizeBlogBody(req.body) as Prisma.BlogUpdateInput;
    const blog = await prisma.blog.update({
      where: { id: existing.id },
      data,
    });

    res.status(200).json({ success: true, data: await hydrateRelatedPosts(blog) });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.blog.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Blog not found', 404);
    }
    await prisma.blog.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
};
