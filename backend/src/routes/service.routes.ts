// src/routes/service.routes.ts

import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) =>
  serviceController.findAll(req, res, next)
);

router.get('/categories', (req, res, next) =>
  serviceController.getCategories(req, res, next)
);

router.get('/:id', (req, res, next) =>
  serviceController.findById(req, res, next)
);

router.post(
  '/',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.create(req, res, next)
);

router.put(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.update(req, res, next)
);

router.delete(
  '/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => serviceController.delete(req, res, next)
);

export default router;
