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
import uploadRoutes from './upload.routes';
import userRouter from './user.routes';
import partRequestRoutes from './part-request.routes';
import settingRoutes from './setting.routes';
import aiRoutes from './ai.routes';
import notificationRoutes from './notification.routes';
import backupRoutes from './backup.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRouter);
router.use('/customers', customerRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/services', serviceRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reports', reportRoutes);
router.use('/uploads', uploadRoutes);
router.use('/gudang/part-requests', partRequestRoutes);
router.use('/settings', settingRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/backup', backupRoutes);

export default router;
