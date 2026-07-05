// src/routes/setting.routes.ts

import { Router } from 'express';
import { settingController } from '../controllers/setting.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Pengaturan sistem bengkel
 *
 * /settings:
 *   get:
 *     summary: Ambil semua pengaturan sistem
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semua pengaturan berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       value:
 *                         type: string
 *                       group:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/', settingController.getAll);

/**
 * @swagger
 * /settings/group/{group}:
 *   get:
 *     summary: Ambil pengaturan berdasarkan grup
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group
 *         required: true
 *         schema:
 *           type: string
 *           enum: [BUSINESS, FINANCE, WORK_ORDER, NOTIFICATION, GENERAL]
 *         example: BUSINESS
 *     responses:
 *       200:
 *         description: Pengaturan grup berhasil diambil
 */
router.get('/group/:group', settingController.getByGroup);

/**
 * @swagger
 * /settings:
 *   post:
 *     summary: Update satu pengaturan (Admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key:
 *                 type: string
 *                 example: business_name
 *               value:
 *                 type: string
 *                 example: Bengkel AutoServis Jaya
 *     responses:
 *       200:
 *         description: Pengaturan berhasil diupdate
 *       403:
 *         description: Forbidden - Hanya Admin
 */
router.post('/', roleMiddleware('ADMIN', 'PIMPINAN'), settingController.update);

/**
 * @swagger
 * /settings/bulk:
 *   post:
 *     summary: Update banyak pengaturan sekaligus (Admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [settings]
 *             properties:
 *               settings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [key, value]
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: string
 *                 example:
 *                   - key: business_name
 *                     value: Bengkel AutoServis
 *                   - key: business_phone
 *                     value: "021-12345678"
 *                   - key: tax_rate
 *                     value: "11"
 *     responses:
 *       200:
 *         description: Semua pengaturan berhasil diupdate
 *       403:
 *         description: Forbidden - Hanya Admin
 */
router.post('/bulk', roleMiddleware('ADMIN', 'PIMPINAN'), settingController.updateBulk);

export default router;
