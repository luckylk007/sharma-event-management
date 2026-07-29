import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { createSlug } from '../utils/helpers.js';
import { asStringArray, serialize } from '../utils/serialize.js';

type ServiceRow = Awaited<ReturnType<typeof prisma.service.findFirst>>;

const serviceSelectLite = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  banner: true,
  icon: true,
} as const;

async function hydrateRelatedServices(service: NonNullable<ServiceRow>) {
  const ids = asStringArray(service.relatedServiceIds);
  const related = ids.length
    ? await prisma.service.findMany({
        where: { id: { in: ids } },
        select: serviceSelectLite,
      })
    : [];
  const byId = new Map(related.map((s) => [s.id, s]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  const { relatedServiceIds: _omit, ...rest } = service;
  return serialize({ ...rest, relatedServices: ordered });
}

function normalizeServiceBody(body: Record<string, unknown>) {
  const data: Record<string, unknown> = { ...body };
  delete data._id;
  delete data.id;
  delete data.relatedServices;
  delete data.createdAt;
  delete data.updatedAt;

  if (data.relatedServiceIds === undefined && Array.isArray(body.relatedServices)) {
    data.relatedServiceIds = (body.relatedServices as Array<string | { _id?: string; id?: string }>).map(
      (item) => (typeof item === 'string' ? item : item._id || item.id || '')
    ).filter(Boolean);
  }

  if (!data.relatedServiceIds) data.relatedServiceIds = [];
  if (!data.includedServices) data.includedServices = [];
  if (!data.gallery) data.gallery = [];
  if (!data.faqs) data.faqs = [];
  if (!data.packages) data.packages = [];

  return data;
}

export const getServices = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const where: Prisma.ServiceWhereInput = {};
    if (req.query.published !== 'all') {
      where.isPublished = true;
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    const data = await Promise.all(services.map((s) => hydrateRelatedServices(s)));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

export const getService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slug = String(req.params.slug);
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.status(200).json({ success: true, data: await hydrateRelatedServices(service) });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.body.slug && req.body.title) {
      req.body.slug = createSlug(req.body.title);
    }

    const data = normalizeServiceBody(req.body) as Prisma.ServiceCreateInput;
    const service = await prisma.service.create({ data });
    res.status(201).json({ success: true, data: await hydrateRelatedServices(service) });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = createSlug(req.body.title);
    }

    const existing = await prisma.service.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Service not found', 404);
    }

    const data = normalizeServiceBody(req.body) as Prisma.ServiceUpdateInput;
    const service = await prisma.service.update({
      where: { id: existing.id },
      data,
    });

    res.status(200).json({ success: true, data: await hydrateRelatedServices(service) });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Service not found', 404);
    }
    await prisma.service.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};
