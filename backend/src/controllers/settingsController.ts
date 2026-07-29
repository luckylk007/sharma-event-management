import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { serialize } from '../utils/serialize.js';
import { buildDefaultSettingsData } from '../utils/settingsDefaults.js';

type SettingsRow = NonNullable<Awaited<ReturnType<typeof prisma.settings.findFirst>>>;

function stripSmtpPass(settings: SettingsRow) {
  const smtp = (settings.smtp || {}) as Record<string, unknown>;
  const { pass: _pass, ...smtpSafe } = smtp;
  return serialize({ ...settings, smtp: smtpSafe });
}

function stripSmtp(settings: SettingsRow) {
  const { smtp: _smtp, ...rest } = settings;
  return serialize(rest);
}

async function getOrCreateSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) return existing;
  return prisma.settings.create({ data: buildDefaultSettingsData() });
}

export const getSettings = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: stripSmtpPass(settings) });
  } catch (error) {
    next(error);
  }
};

export const getPublicSettings = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ success: true, data: stripSmtp(settings) });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const body = { ...req.body };
    delete body._id;
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: buildDefaultSettingsData(body),
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: body,
      });
    }

    res.status(200).json({ success: true, data: stripSmtpPass(settings) });
  } catch (error) {
    next(error);
  }
};

export const getPrivacy = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    if (!settings) throw new AppError('Settings not found', 404);
    res.status(200).json({
      success: true,
      data: { content: settings.privacyPolicy, companyName: settings.companyName },
    });
  } catch (error) {
    next(error);
  }
};

export const getTerms = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    if (!settings) throw new AppError('Settings not found', 404);
    res.status(200).json({
      success: true,
      data: { content: settings.termsConditions, companyName: settings.companyName },
    });
  } catch (error) {
    next(error);
  }
};
