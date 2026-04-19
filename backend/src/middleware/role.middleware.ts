// src/middleware/role.middleware.ts

import { Response, NextFunction, Request } from 'express';
import { UserRole } from '@prisma/client';
import { sendUnauthorized, sendForbidden } from '../utils/response.util';

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendUnauthorized(res);
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      sendForbidden(res);
      return;
    }

    next();
  };
};
