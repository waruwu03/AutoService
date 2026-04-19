// src/routes/inventory.routes.ts

import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

// Spareparts
router.get('/spareparts', (req, res, next) =>
  inventoryController.findAllSpareparts(req, res, next)
);

router.get('/spareparts/low-stock', (req, res, next) =>
  inventoryController.getLowStock(req, res, next)
);

router.get('/spareparts/:id', (req, res, next) =>
  inventoryController.findSparepartById(req, res, next)
);

router.post(
  '/spareparts',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.createSparepart(req, res, next)
);

router.put(
  '/spareparts/:id',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.updateSparepart(req, res, next)
);

router.delete(
  '/spareparts/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => inventoryController.deleteSparepart(req, res, next)
);

router.post(
  '/spareparts/:id/adjust',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.adjustStock(req, res, next)
);

router.get('/spareparts/:id/movements', (req, res, next) =>
  inventoryController.getStockMovements(req, res, next)
);

// Suppliers
router.get('/suppliers', (req, res, next) =>
  inventoryController.findAllSuppliers(req, res, next)
);

router.get('/suppliers/:id', (req, res, next) =>
  inventoryController.findSupplierById(req, res, next)
);

router.post(
  '/suppliers',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.createSupplier(req, res, next)
);

router.put(
  '/suppliers/:id',
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => inventoryController.updateSupplier(req, res, next)
);

router.delete(
  '/suppliers/:id',
  roleMiddleware('ADMIN'),
  (req, res, next) => inventoryController.deleteSupplier(req, res, next)
);

export default router;
