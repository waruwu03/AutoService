// src/utils/token.util.ts

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { jwtConfig } from '../config/jwt.config';
import { JwtPayload } from '../types/express';

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as any,
  });
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
}

export function getRefreshTokenExpiry(): Date {
  const match = jwtConfig.refreshExpiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    // Default to 7 days
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + value * (multipliers[unit] || 86400000));
}
