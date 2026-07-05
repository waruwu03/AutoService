// src/routes/part-request.routes.ts

import { Router } from 'express';
import { partRequestController } from '../controllers/part-request.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Part Requests
 *   description: Permintaan sparepart dari mekanik ke gudang
 *
 * /gudang/part-requests:
 *   get:
 *     summary: Ambil semua permintaan sparepart
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, FULFILLED]
 *     responses:
 *       200:
 *         description: Daftar permintaan sparepart berhasil diambil
 */
router.get('/', (req, res, next) => 
  partRequestController.findAll(req, res, next)
);

/**
 * @swagger
 * /gudang/part-requests:
 *   post:
 *     summary: Buat permintaan sparepart baru (Admin/Mekanik)
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               workOrderId:
 *                 type: string
 *                 format: uuid
 *                 description: ID work order terkait (opsional)
 *               notes:
 *                 type: string
 *                 example: Dibutuhkan untuk WO-2026-001
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [sparepartId, quantity]
 *                   properties:
 *                     sparepartId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *                     notes:
 *                       type: string
 *     responses:
 *       201:
 *         description: Permintaan sparepart berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
router.post('/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => partRequestController.create(req, res, next)
);

/**
 * @swagger
 * /gudang/part-requests/{id}:
 *   get:
 *     summary: Ambil detail permintaan sparepart
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Detail permintaan sparepart berhasil diambil
 *       404:
 *         description: Permintaan tidak ditemukan
 */
router.get('/:id', (req, res, next) => 
  partRequestController.findById(req, res, next)
);

/**
 * @swagger
 * /gudang/part-requests/{id}/approve:
 *   post:
 *     summary: Setujui permintaan sparepart (Admin/Gudang)
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Disetujui, stok tersedia
 *               items:
 *                 type: array
 *                 description: Override jumlah yang diberikan per item (opsional)
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       format: uuid
 *                     quantityGiven:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Permintaan sparepart berhasil disetujui dan stok dikurangi
 *       400:
 *         description: Status permintaan bukan PENDING atau stok tidak mencukupi
 */
router.post('/:id/approve', 
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => partRequestController.approve(req, res, next)
);

/**
 * @swagger
 * /gudang/part-requests/{id}/reject:
 *   post:
 *     summary: Tolak permintaan sparepart (Admin/Gudang)
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Stok habis, sedang dalam proses reorder
 *     responses:
 *       200:
 *         description: Permintaan sparepart berhasil ditolak
 *       400:
 *         description: Status permintaan bukan PENDING
 */
router.post('/:id/reject', 
  roleMiddleware('ADMIN', 'GUDANG'),
  (req, res, next) => partRequestController.reject(req, res, next)
);

/**
 * @swagger
 * /gudang/part-requests/{id}/fulfill:
 *   post:
 *     summary: Konfirmasi penerimaan part (Mekanik/Admin)
 *     tags: [Part Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Part berhasil diterima
 *       400:
 *         description: Status permintaan bukan APPROVED
 */
router.post('/:id/fulfill', 
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => partRequestController.fulfill(req, res, next)
);

export default router;
