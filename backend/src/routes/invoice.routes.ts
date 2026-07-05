// src/routes/invoice.routes.ts

import { Router } from 'express';
import { invoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Manajemen invoice dan pembayaran
 *
 * /invoices:
 *   get:
 *     summary: Ambil semua invoice (Admin/Pimpinan)
 *     tags: [Invoices]
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
 *           enum: [DRAFT, SENT, PAID, PARTIAL, OVERDUE, CANCELLED, REFUNDED]
 *       - in: query
 *         name: customerId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Daftar invoice berhasil diambil
 *       403:
 *         description: Forbidden - Hanya Admin dan Pimpinan
 */
router.get(
  '/',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.findAll(req, res, next)
);

/**
 * @swagger
 * /invoices/overdue:
 *   get:
 *     summary: Ambil invoice yang sudah jatuh tempo (Admin/Pimpinan)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar invoice overdue berhasil diambil
 */
router.get(
  '/overdue',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.getOverdue(req, res, next)
);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Ambil invoice berdasarkan ID (Admin/Pimpinan)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data invoice berhasil diambil
 *       404:
 *         description: Invoice tidak ditemukan
 */
router.get(
  '/:id',
  roleMiddleware('ADMIN', 'PIMPINAN'),
  (req, res, next) => invoiceController.findById(req, res, next)
);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Buat invoice dari work order (Admin only)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workOrderId, dueDate]
 *             properties:
 *               workOrderId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               notes:
 *                 type: string
 *                 example: Mohon segera dilunasi
 *     responses:
 *       201:
 *         description: Invoice berhasil dibuat
 *       400:
 *         description: Work order belum selesai atau invoice sudah ada
 */
router.post(
  '/',
  roleMiddleware('ADMIN'),
  (req, res, next) => invoiceController.createFromWorkOrder(req, res, next)
);

/**
 * @swagger
 * /invoices/payments:
 *   post:
 *     summary: Catat pembayaran invoice (Admin only)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoiceId, amount, paymentMethod]
 *             properties:
 *               invoiceId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               amount:
 *                 type: number
 *                 example: 500000
 *               paymentMethod:
 *                 type: string
 *                 enum: [CASH, TRANSFER, DEBIT_CARD, CREDIT_CARD, QRIS, E_WALLET, CREDIT]
 *                 example: CASH
 *               referenceNumber:
 *                 type: string
 *                 description: Nomor referensi transfer/bukti bayar
 *               notes:
 *                 type: string
 *                 example: Pembayaran tunai
 *     responses:
 *       201:
 *         description: Pembayaran berhasil dicatat
 *       400:
 *         description: Jumlah pembayaran melebihi sisa tagihan
 */
router.post(
  '/payments',
  roleMiddleware('ADMIN'),
  (req, res, next) => invoiceController.recordPayment(req, res, next)
);

/**
 * @swagger
 * /invoices/{id}/send-email:
 *   post:
 *     summary: Kirim email invoice ke customer (Admin only)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Email berhasil dikirim
 *       400:
 *         description: Customer tidak memiliki email
 *       404:
 *         description: Invoice tidak ditemukan
 */
router.post(
  '/:id/send-email',
  roleMiddleware('ADMIN'),
  (req, res, next) => invoiceController.sendEmail(req, res, next)
);

export default router;
