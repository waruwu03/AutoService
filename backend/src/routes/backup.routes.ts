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
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup multer for JSON file upload (store temporarily in storage/uploads)
const tempUploadDir = path.join(process.cwd(), 'storage', 'uploads');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}
const upload = multer({ dest: tempUploadDir });

router.get('/export', roleMiddleware('ADMIN', 'PIMPINAN'), backupController.exportBackup);

router.get('/local', roleMiddleware('ADMIN', 'PIMPINAN'), backupController.getLocalBackups);

router.post('/restore', roleMiddleware('ADMIN', 'PIMPINAN'), upload.single('backupFile'), backupController.restoreBackup);

export default router;
