// src/routes/user.routes.ts

import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen user sistem
 *
 * /users:
 *   get:
 *     summary: Ambil semua user
 *     tags: [Users]
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
 *         description: Cari berdasarkan nama atau email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, MEKANIK, GUDANG, PIMPINAN]
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get('/', (req, res, next) => userController.findAll(req, res, next));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Ambil user berdasarkan ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       404:
 *         description: User tidak ditemukan
 */
router.get('/:id', (req, res, next) => userController.findById(req, res, next));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Buat user baru (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Budi Mekanik
 *               email:
 *                 type: string
 *                 format: email
 *                 example: budi@autoservis.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEKANIK, GUDANG, PIMPINAN]
 *                 example: MEKANIK
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               address:
 *                 type: string
 *                 example: Jl. Contoh No. 1
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 *       400:
 *         description: Validasi gagal
 *       403:
 *         description: Forbidden - Hanya Admin
 */
router.post('/', roleMiddleware('ADMIN', 'PIMPINAN'), (req, res, next) => userController.create(req, res, next));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEKANIK, GUDANG, PIMPINAN]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 *       404:
 *         description: User tidak ditemukan
 */
router.put('/:id', roleMiddleware('ADMIN', 'PIMPINAN'), (req, res, next) => userController.update(req, res, next));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Hapus user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       404:
 *         description: User tidak ditemukan
 */
router.delete('/:id', roleMiddleware('ADMIN', 'PIMPINAN'), (req, res, next) => userController.delete(req, res, next));

export default router;
