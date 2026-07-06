// src/routes/backup.routes.ts

import { Router } from 'express';
import { backupController } from '../controllers/backup.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Backup
 *   description: Backup & ekspor data sistem
 *
 * /backup/export:
 *   get:
 *     summary: Export semua data sebagai backup JSON (Admin only)
 *     tags: [Backup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File JSON backup berhasil diunduh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Forbidden - Hanya Admin
 */
router.get('/export', roleMiddleware('ADMIN', 'PIMPINAN'), backupController.exportBackup);

export default router;
