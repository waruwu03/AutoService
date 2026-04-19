// src/routes/invoice.routes.ts

import { Router } from 'express';
import { invoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.findAll(req, res, next)
);

router.get(
  '/overdue',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.getOverdue(req, res, next)
);

router.get(
  '/:id',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.findById(req, res, next)
);

router.post(
  '/',
  roleMiddleware('ADMIN'),
  (req, res, next) => invoiceController.createFromWorkOrder(req, res, next)
);

router.post(
  '/payments',
  roleMiddleware('ADMIN'),
  (req, res, next) => invoiceController.recordPayment(req, res, next)
);

export default router;
