// src/routes/report.routes.ts

import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', (req, res, next) =>
  reportController.getDashboard(req, res, next)
);

router.get(
  '/revenue',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => reportController.getRevenue(req, res, next)
);

router.get(
  '/mechanics',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) =>
    reportController.getMechanicPerformance(req, res, next)
);

router.get(
  '/work-orders',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) =>
    reportController.getWorkOrderStats(req, res, next)
);

export default router;
