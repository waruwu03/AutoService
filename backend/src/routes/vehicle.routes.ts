// src/routes/vehicle.routes.ts

import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) =>
  vehicleController.findAll(req, res, next)
);

router.get('/:id', (req, res, next) =>
  vehicleController.findById(req, res, next)
);

router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => vehicleController.create(req, res, next)
);

router.put(
  '/:id',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => vehicleController.update(req, res, next)
);

router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => vehicleController.delete(req, res, next)
);

router.get('/:id/history', (req, res, next) =>
  vehicleController.getHistory(req, res, next)
);

export default router;
