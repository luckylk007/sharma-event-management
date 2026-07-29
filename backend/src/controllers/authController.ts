import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../middlewares/errorHandler.js';
import { sendTokenResponse } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { serialize } from '../utils/serialize.js';

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    sendTokenResponse(
      { _id: updated.id, name: updated.name, email: updated.email, role: updated.role },
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: AuthRequest, res: Response): void => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json({ success: true, data: serialize(user) });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user || !(await comparePassword(currentPassword, user.password))) {
      throw new AppError('Current password is incorrect', 401);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(newPassword) },
    });

    sendTokenResponse(
      { _id: updated.id, name: updated.name, email: updated.email, role: updated.role },
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};
