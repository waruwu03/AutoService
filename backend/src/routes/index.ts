// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import vehicleRoutes from './vehicle.routes';
import serviceRoutes from './service.routes';
import workOrderRoutes from './work-order.routes';
import inventoryRoutes from './inventory.routes';
import invoiceRoutes from './invoice.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/services', serviceRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reports', reportRoutes);

export default router;
