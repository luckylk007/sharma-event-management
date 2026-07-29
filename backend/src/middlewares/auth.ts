import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AppError } from './errorHandler.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _id?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized. Please log in.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive.', 401);
    }

    req.user = { ...user, _id: user.id };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Not authorized. Invalid token.', 401));
    }
  }
};

export const adminOnly = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    next(new AppError('Admin access required.', 403));
    return;
  }
  next();
};
