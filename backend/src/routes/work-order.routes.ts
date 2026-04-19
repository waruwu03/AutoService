// src/routes/work-order.routes.ts

import { Router } from 'express';
import { workOrderController } from '../controllers/work-order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) =>
  workOrderController.findAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
  workOrderController.findById(req, res, next)
);

router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.create(req, res, next)
);

router.put(
  '/:id/status',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.updateStatus(req, res, next)
);

router.put(
  '/:id/assign',
  roleMiddleware('ADMIN'),
  (req, res, next) => workOrderController.assignMechanic(req, res, next)
);

router.post(
  '/:id/services',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.addService(req, res, next)
);

router.delete(
  '/:id/services/:serviceId',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.removeService(req, res, next)
);

router.post(
  '/:id/spareparts',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.addSparepart(req, res, next)
);

export default router;
