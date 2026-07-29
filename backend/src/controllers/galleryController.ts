import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/upload.js';
import { serialize } from '../utils/serialize.js';

function normalizeGalleryBody(body: Record<string, unknown>) {
  const data: Record<string, unknown> = { ...body };
  delete data._id;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
}

export const getGallery = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const where: Prisma.GalleryItemWhereInput = {};
    if (req.query.category && req.query.category !== 'all') {
      where.category = String(req.query.category);
    }
    if (req.query.featured === 'true') {
      where.isFeatured = true;
    }

    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.galleryItem.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: skip + items.length < total,
      data: serialize(items),
    });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = normalizeGalleryBody(req.body) as Prisma.GalleryItemCreateInput;
    const item = await prisma.galleryItem.create({ data });
    res.status(201).json({ success: true, data: serialize(item) });
  } catch (error) {
    next(error);
  }
};

export const uploadGalleryImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      throw new AppError('No images uploaded', 400);
    }

    const allowed = ['Wedding', 'Corporate', 'Birthday', 'Kitty Party', 'Mata Ka Jagrata'] as const;
    type GalleryCategory = (typeof allowed)[number];
    const rawCategory = String(req.body.category || 'Wedding');
    const category: GalleryCategory = allowed.includes(rawCategory as GalleryCategory)
      ? (rawCategory as GalleryCategory)
      : 'Wedding';

    const items = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, 'sharma-events/gallery');
      const item = await prisma.galleryItem.create({
        data: {
          image: {
            url: result.url,
            publicId: result.publicId,
            alt: req.body.alt || file.originalname,
            caption: req.body.caption || '',
            width: result.width,
            height: result.height,
          },
          category,
          title: req.body.title || file.originalname.replace(/\.[^/.]+$/, ''),
          isFeatured: req.body.isFeatured === 'true',
        },
      });
      items.push(item);
    }

    res.status(201).json({ success: true, count: items.length, data: serialize(items) });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.galleryItem.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Gallery item not found', 404);
    }

    const data = normalizeGalleryBody(req.body) as Prisma.GalleryItemUpdateInput;
    const item = await prisma.galleryItem.update({
      where: { id: existing.id },
      data,
    });
    res.status(200).json({ success: true, data: serialize(item) });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await prisma.galleryItem.findUnique({ where: { id: String(req.params.id) } });
    if (!item) {
      throw new AppError('Gallery item not found', 404);
    }

    const image = item.image as { publicId?: string } | null;
    if (image?.publicId) {
      await deleteFromCloudinary(image.publicId);
    }

    await prisma.galleryItem.delete({ where: { id: item.id } });
    res.status(200).json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
};
