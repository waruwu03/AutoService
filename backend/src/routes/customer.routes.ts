// src/routes/customer.routes.ts

import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) =>
  customerController.findAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
  customerController.findById(req, res, next)
);

router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => customerController.create(req, res, next)
);

router.put(
  '/:id',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => customerController.update(req, res, next)
);

router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => customerController.delete(req, res, next)
);

router.get('/:id/vehicles', (req, res, next) =>
  customerController.getVehicles(req, res, next)
);

router.get('/:id/history', (req, res, next) =>
  customerController.getHistory(req, res, next)
);

export default router;
