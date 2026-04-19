// src/routes/auth.routes.ts

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// Public routes
router.post('/login', authLimiter, (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/refresh', (req, res, next) =>
  authController.refresh(req, res, next)
);

// Protected routes
router.post(
  '/register',
  authMiddleware,
  roleMiddleware('ADMIN'),
  (req, res, next) => authController.register(req, res, next)
);

router.post('/logout', authMiddleware, (req, res, next) =>
  authController.logout(req, res, next)
);

router.get('/me', authMiddleware, (req, res, next) =>
  authController.getProfile(req, res, next)
);

router.put('/change-password', authMiddleware, (req, res, next) =>
  authController.changePassword(req, res, next)
);

export default router;
