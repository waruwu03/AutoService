// src/routes/work-order.routes.ts

import { Router } from 'express';
import { workOrderController } from '../controllers/work-order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Work Orders
 *   description: Manajemen Work Order (SPK) servis kendaraan
 *
 * /work-orders:
 *   get:
 *     summary: Ambil semua work order
 *     tags: [Work Orders]
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
 *         name: search
 *         schema: { type: string }
 *         description: Cari berdasarkan nomor WO atau nama pelanggan
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING, IN_PROGRESS, WAITING_PARTS, QUALITY_CHECK, COMPLETED, INVOICED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, NORMAL, HIGH, URGENT]
 *       - in: query
 *         name: mechanicId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Daftar work order berhasil diambil
 */
router.get('/', (req, res, next) =>
  workOrderController.findAll(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}:
 *   get:
 *     summary: Ambil work order berdasarkan ID
 *     tags: [Work Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data work order berhasil diambil
 *       404:
 *         description: Work order tidak ditemukan
 */
router.get('/:id', (req, res, next) =>
  workOrderController.findById(req, res, next)
);

/**
 * @swagger
 * /work-orders:
 *   post:
 *     summary: Buat work order baru (Admin/Mekanik)
 *     tags: [Work Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, vehicleId]
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               vehicleId:
 *                 type: string
 *                 format: uuid
 *                 example: "660e8400-e29b-41d4-a716-446655440000"
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH, URGENT]
 *                 example: NORMAL
 *               customerComplaints:
 *                 type: string
 *                 example: "Mesin bergetar dan AC tidak dingin"
 *               odometerIn:
 *                 type: integer
 *                 example: 52000
 *               fuelLevel:
 *                 type: string
 *                 example: "3/4"
 *               estimatedCompletion:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-25T17:00:00Z"
 *               internalNotes:
 *                 type: string
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: ID layanan yang akan dikerjakan
 *     responses:
 *       201:
 *         description: Work order berhasil dibuat
 *       400:
 *         description: Validasi gagal
 */
router.post(
  '/',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.create(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}:
 *   patch:
 *     summary: Update work order (Admin/Mekanik)
 *     tags: [Work Orders]
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
 *             properties:
 *               customerComplaints:
 *                 type: string
 *               mechanicNotes:
 *                 type: string
 *               internalNotes:
 *                 type: string
 *               estimatedCompletion:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [LOW, NORMAL, HIGH, URGENT]
 *               discountPercent:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Work order berhasil diupdate
 *       404:
 *         description: Work order tidak ditemukan
 */
router.patch(
  '/:id',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.update(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}/status:
 *   put:
 *     summary: Update status work order (Admin/Mekanik)
 *     tags: [Work Orders]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PENDING, IN_PROGRESS, WAITING_PARTS, QUALITY_CHECK, COMPLETED, INVOICED, CANCELLED]
 *                 example: IN_PROGRESS
 *               notes:
 *                 type: string
 *                 example: Mulai dikerjakan
 *     responses:
 *       200:
 *         description: Status work order berhasil diupdate
 *       400:
 *         description: Transisi status tidak valid
 *       404:
 *         description: Work order tidak ditemukan
 */
router.put(
  '/:id/status',
  roleMiddleware('ADMIN', 'MEKANIK', 'PIMPINAN'),
  (req, res, next) => workOrderController.updateStatus(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}/assign:
 *   put:
 *     summary: Assign mekanik ke work order (Admin only)
 *     tags: [Work Orders]
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
 *             required: [mechanicId]
 *             properties:
 *               mechanicId:
 *                 type: string
 *                 format: uuid
 *                 example: "770e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Mekanik berhasil di-assign
 *       404:
 *         description: Work order atau mekanik tidak ditemukan
 */
router.put(
  '/:id/assign',
  roleMiddleware('ADMIN'),
  (req, res, next) => workOrderController.assignMechanic(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}/services:
 *   post:
 *     summary: Tambah layanan ke work order (Admin/Mekanik)
 *     tags: [Work Orders]
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
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 default: 1
 *               discountPercent:
 *                 type: number
 *                 default: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Layanan berhasil ditambahkan ke work order
 */
router.post(
  '/:id/services',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.addService(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}/services/{serviceId}:
 *   delete:
 *     summary: Hapus layanan dari work order (Admin/Mekanik)
 *     tags: [Work Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Layanan berhasil dihapus dari work order
 */
router.delete(
  '/:id/services/:serviceId',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.removeService(req, res, next)
);

/**
 * @swagger
 * /work-orders/{id}/spareparts:
 *   post:
 *     summary: Tambah sparepart ke work order (Admin/Mekanik)
 *     tags: [Work Orders]
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
 *             required: [sparepartId, quantity]
 *             properties:
 *               sparepartId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               discountPercent:
 *                 type: number
 *                 default: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sparepart berhasil ditambahkan ke work order
 *       400:
 *         description: Stok tidak mencukupi
 */
router.post(
  '/:id/spareparts',
  roleMiddleware('ADMIN', 'MEKANIK'),
  (req, res, next) => workOrderController.addSparepart(req, res, next)
);

export default router;
