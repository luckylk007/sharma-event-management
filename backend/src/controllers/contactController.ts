import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendEmail, contactNotificationHtml } from '../utils/email.js';
import { serialize } from '../utils/serialize.js';
import { buildDefaultSettingsData } from '../utils/settingsDefaults.js';

async function ensureSettings() {
  const existing = await prisma.settings.findFirst();
  if (existing) return existing;
  return prisma.settings.create({ data: buildDefaultSettingsData() });
}

export const submitContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contact = await prisma.contact.create({
      data: {
        name: req.body.name,
        email: String(req.body.email).toLowerCase(),
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message,
        service: req.body.service,
        eventDate: req.body.eventDate ? new Date(req.body.eventDate) : undefined,
        source: req.body.source || 'contact-form',
      },
    });
    const settings = await ensureSettings();

    await sendEmail({
      to: settings.email || process.env.ADMIN_EMAIL || 'admin@sharmaevents.com',
      subject: `New Enquiry: ${contact.subject}`,
      html: contactNotificationHtml({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        service: contact.service || undefined,
      }),
    });

    await sendEmail({
      to: contact.email,
      subject: 'Thank you for contacting Sharma Event Management',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank You, ${contact.name}!</h2>
          <p>We've received your enquiry and will get back to you within 24 hours.</p>
          <p>Warm regards,<br/><strong>Sharma Event Management</strong><br/>Haldwani, Uttarakhand</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! We will get back to you soon.',
      data: { id: contact.id },
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const where: Prisma.ContactWhereInput = {};
    if (req.query.status) where.status = String(req.query.status);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: serialize(contacts),
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.contact.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Contact not found', 404);
    }

    const contact = await prisma.contact.update({
      where: { id: existing.id },
      data: { status: req.body.status },
    });
    res.status(200).json({ success: true, data: serialize(contact) });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existing = await prisma.contact.findUnique({ where: { id: String(req.params.id) } });
    if (!existing) {
      throw new AppError('Contact not found', 404);
    }
    await prisma.contact.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

export const exportContacts = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    const header = 'Name,Email,Phone,Subject,Message,Service,Status,Date\n';
    const rows = contacts
      .map((c) =>
        [
          `"${c.name}"`,
          `"${c.email}"`,
          `"${c.phone}"`,
          `"${c.subject.replace(/"/g, '""')}"`,
          `"${c.message.replace(/"/g, '""')}"`,
          `"${c.service || ''}"`,
          c.status,
          c.createdAt.toISOString(),
        ].join(',')
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.status(200).send(header + rows);
  } catch (error) {
    next(error);
  }
};
