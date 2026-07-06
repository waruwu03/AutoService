// src/controllers/backup.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';

export class BackupController {
  /**
   * Export semua data dari database menjadi file JSON.
   * Hanya bisa diakses oleh ADMIN / PIMPINAN.
   *
   * Nama model Prisma sesuai schema.prisma:
   *   - Sparepart     → prisma.sparepart
   *   - Supplier      → prisma.supplier
   *   - WorkOrder     → prisma.workOrder  (relasi: services, spareparts, partRequests)
   *   - PartRequest   → prisma.partRequest
   *   - StockMovement → prisma.stockMovement
   */
  async exportBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

      // Ambil semua data secara paralel
      const [
        users,
        customers,
        vehicles,
        services,
        workOrders,
        spareparts,
        suppliers,
        invoices,
        settings,
        partRequests,
        stockMovements,
      ] = await Promise.all([
        // Users — password TIDAK diikutsertakan demi keamanan
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            photoUrl: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        }),

        // Pelanggan
        prisma.customer.findMany(),

        // Kendaraan
        prisma.vehicle.findMany(),

        // Jasa Servis
        prisma.service.findMany(),

        // Work Orders + relasi sesuai schema
        prisma.workOrder.findMany({
          include: {
            services: true,     // WorkOrderService[]
            spareparts: true,   // WorkOrderSparepart[]
            partRequests: true, // PartRequest[]
          },
        }),

        // ✅ Model Prisma: Sparepart (bukan inventoryItem)
        prisma.sparepart.findMany(),

        // Supplier
        prisma.supplier.findMany(),

        // Invoice + Pembayaran
        prisma.invoice.findMany({
          include: {
            payments: true,
          },
        }),

        // Pengaturan sistem
        prisma.setting.findMany(),

        // Part Requests + item detail
        prisma.partRequest.findMany({
          include: {
            items: true,
          },
        }),

        // Riwayat pergerakan stok
        prisma.stockMovement.findMany(),
      ]);

      const backupPayload = {
        metadata: {
          appName: 'AutoService',
          exportedAt: now.toISOString(),
          exportedBy: (req as any).user?.email ?? 'unknown',
          version: '1.0',
          totalRecords: {
            users: users.length,
            customers: customers.length,
            vehicles: vehicles.length,
            services: services.length,
            workOrders: workOrders.length,
            spareparts: spareparts.length,
            suppliers: suppliers.length,
            invoices: invoices.length,
            settings: settings.length,
            partRequests: partRequests.length,
            stockMovements: stockMovements.length,
          },
        },
        data: {
          users,
          customers,
          vehicles,
          services,
          workOrders,
          spareparts,
          suppliers,
          invoices,
          settings,
          partRequests,
          stockMovements,
        },
      };

      const jsonStr = JSON.stringify(backupPayload, null, 2);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="autoservice-backup-${timestamp}.json"`
      );
      res.setHeader('Content-Length', Buffer.byteLength(jsonStr, 'utf8'));

      return res.send(jsonStr);
    } catch (error) {
      next(error);
    }
  }
}

export const backupController = new BackupController();
