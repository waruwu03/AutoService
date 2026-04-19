// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token.util';
import { prisma } from '../config/database.config';
import { sendUnauthorized } from '../utils/response.util';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Access token required');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      sendUnauthorized(res, 'User not found or inactive');
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    sendUnauthorized(res, 'Invalid token');
  }
};
