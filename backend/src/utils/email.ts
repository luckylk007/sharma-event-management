import nodemailer from 'nodemailer';
import { prisma } from '../lib/prisma.js';

type SmtpConfig = {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> => {
  try {
    const settings = await prisma.settings.findFirst();
    const smtp = (settings?.smtp || {}) as SmtpConfig;
    const host = smtp.host || process.env.SMTP_HOST;
    const port = smtp.port || Number(process.env.SMTP_PORT) || 587;
    const user = smtp.user || process.env.SMTP_USER;
    const pass = smtp.pass || process.env.SMTP_PASS;
    const from = smtp.from || process.env.SMTP_FROM;

    if (!user || !pass) {
      console.log('Email skipped (SMTP not configured):', options.subject);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const contactNotificationHtml = (data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service?: string;
}): string => `
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="border-bottom: 2px solid #c9a227; padding-bottom: 12px;">New Enquiry Received</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    ${data.service ? `<p><strong>Service:</strong> ${data.service}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p style="background: #f5f5f0; padding: 16px; border-left: 3px solid #c9a227;">${data.message}</p>
  </div>
`;
