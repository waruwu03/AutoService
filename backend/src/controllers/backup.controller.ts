// src/controllers/backup.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'storage', 'backups');

export class BackupController {

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  private async generateBackupPayload(userEmail: string = 'system') {
    const now = new Date();

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
      prisma.user.findMany({
        select: {
          id: true, name: true, email: true, role: true, phone: true,
          address: true, photoUrl: true, isActive: true, createdAt: true, updatedAt: true,
        },
      }),
      prisma.customer.findMany(),
      prisma.vehicle.findMany(),
      prisma.service.findMany(),
      prisma.workOrder.findMany({
        include: { services: true, spareparts: true, partRequests: true },
      }),
      prisma.sparepart.findMany(),
      prisma.supplier.findMany(),
      prisma.invoice.findMany({ include: { payments: true } }),
      prisma.setting.findMany(),
      prisma.partRequest.findMany({ include: { items: true } }),
      prisma.stockMovement.findMany(),
    ]);

    return {
      metadata: {
        appName: 'AutoService',
        exportedAt: now.toISOString(),
        exportedBy: userEmail,
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
        users, customers, vehicles, services, workOrders, spareparts,
        suppliers, invoices, settings, partRequests, stockMovements,
      },
    };
  }

  async exportBackup(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const userEmail = (req as any).user?.email ?? 'unknown';

      const backupPayload = await this.generateBackupPayload(userEmail);
      const jsonStr = JSON.stringify(backupPayload, null, 2);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="autoservice-backup-${timestamp}.json"`);
      res.setHeader('Content-Length', Buffer.byteLength(jsonStr, 'utf8'));

      return res.send(jsonStr);
    } catch (error) {
      next(error);
    }
  }

  async createLocalBackup() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupPayload = await this.generateBackupPayload('auto-backup-cron');
    
    const fileName = `autoservice-autobackup-${timestamp}.json`;
    const filePath = path.join(BACKUP_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(backupPayload, null, 2), 'utf8');
    return filePath;
  }

  async cleanupOldBackups(daysToKeep: number = 14) {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = Date.now();
    const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
        }
      }
    }
  }

  async getLocalBackups(req: Request, res: Response, next: NextFunction) {
    try {
      if (!fs.existsSync(BACKUP_DIR)) {
        return res.json({ data: [] });
      }
      
      const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));
      const backups = files.map(file => {
        const stats = fs.statSync(path.join(BACKUP_DIR, file));
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.mtime
        };
      }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      res.json({ data: backups });
    } catch (error) {
      next(error);
    }
  }

  async restoreBackup(req: Request, res: Response, next: NextFunction) {
    try {
      let backupPayload: any = null;

      // Restore can happen via an uploaded file OR via a filename provided in body
      if (req.file) {
        // From uploaded file
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        backupPayload = JSON.parse(fileContent);
        // Clean up temp upload file
        fs.unlinkSync(req.file.path);
      } else if (req.body.filename) {
        // From local server backup
        const filePath = path.join(BACKUP_DIR, req.body.filename);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: 'File backup tidak ditemukan di server.' });
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        backupPayload = JSON.parse(fileContent);
      } else {
        return res.status(400).json({ error: 'File backup tidak disediakan.' });
      }

      if (!backupPayload.data || !backupPayload.metadata) {
        return res.status(400).json({ error: 'Format file backup tidak valid.' });
      }

      const d = backupPayload.data;

      // Start a massive transaction to wipe and re-insert
      await prisma.$transaction(async (tx) => {
        // 1. DELETE ALL RECORDS in REVERSE dependency order
        // Disabling foreign key checks is the only safe way to drop everything in mysql if there are cyclic references,
        // but Prisma doesn't officially support TRUNCATE CASCADE easily. 
        // We will try deleting in order.
        await tx.payment.deleteMany();
        await tx.partRequestItem.deleteMany();
        await tx.workOrderService.deleteMany();
        await tx.workOrderSparepart.deleteMany();
        await tx.invoice.deleteMany();
        await tx.partRequest.deleteMany();
        await tx.stockMovement.deleteMany();
        await tx.workOrder.deleteMany();
        
        await tx.serviceReminder.deleteMany();
        await tx.vehicle.deleteMany();
        await tx.customer.deleteMany();
        
        await tx.sparepart.deleteMany();
        await tx.supplier.deleteMany();
        
        await tx.service.deleteMany();
        await tx.setting.deleteMany();
        // Skip deleting users since we don't have their passwords in backup!
        // We will only insert non-existing users, or just skip restoring users entirely.
        // Wait! The auto-backup drops password. If we delete users, they can't login anymore!
        // So DO NOT delete users. 

        // 2. INSERT RECORDS
        
        // Users (Only those who don't exist, we can't just create them without passwords)
        // Since we don't want to mess up user logins, we can just skip restoring users if they exist.
        // Better: update their details if they exist.
        for (const user of d.users || []) {
           const exists = await tx.user.findUnique({ where: { id: user.id } });
           if (exists) {
             await tx.user.update({ where: { id: user.id }, data: user });
           } else {
             // We can't insert a user without a password. So we give a default password and they must reset it.
             // Or skip. Let's just create with a generic password '123456' hash.
             await tx.user.create({ data: { ...user, password: '$2a$10$3tK19M/G0H7bE.fQj/VZX.4R6qR5Y6J2H3L6Q5Q9J4Q9J4Q9J4Q9J' }}); // dummy hash
           }
        }

        if (d.settings?.length > 0) await tx.setting.createMany({ data: d.settings });
        if (d.services?.length > 0) await tx.service.createMany({ data: d.services });
        if (d.suppliers?.length > 0) await tx.supplier.createMany({ data: d.suppliers });
        if (d.spareparts?.length > 0) await tx.sparepart.createMany({ data: d.spareparts });
        
        if (d.customers?.length > 0) await tx.customer.createMany({ data: d.customers });
        if (d.vehicles?.length > 0) await tx.vehicle.createMany({ data: d.vehicles });
        
        // Clean up workOrders before inserting
        const wos = (d.workOrders || []).map((w: any) => {
            const { services, spareparts, partRequests, ...rest } = w;
            return rest;
        });
        if (wos.length > 0) await tx.workOrder.createMany({ data: wos });

        if (d.stockMovements?.length > 0) await tx.stockMovement.createMany({ data: d.stockMovements });
        
        // Invoices
        const invs = (d.invoices || []).map((i: any) => {
            const { payments, ...rest } = i;
            return rest;
        });
        if (invs.length > 0) await tx.invoice.createMany({ data: invs });
        
        // Part requests
        const prs = (d.partRequests || []).map((p: any) => {
            const { items, ...rest } = p;
            return rest;
        });
        if (prs.length > 0) await tx.partRequest.createMany({ data: prs });

        // Dependencies inside WorkOrders
        const allWoServices = [];
        const allWoParts = [];
        for (const w of d.workOrders || []) {
           if (w.services) allWoServices.push(...w.services);
           if (w.spareparts) allWoParts.push(...w.spareparts);
        }
        if (allWoServices.length > 0) await tx.workOrderService.createMany({ data: allWoServices });
        if (allWoParts.length > 0) await tx.workOrderSparepart.createMany({ data: allWoParts });

        // PartRequest Items
        const allPrItems = [];
        for (const p of d.partRequests || []) {
           if (p.items) allPrItems.push(...p.items);
        }
        if (allPrItems.length > 0) await tx.partRequestItem.createMany({ data: allPrItems });

        // Payments
        const allPayments = [];
        for (const i of d.invoices || []) {
           if (i.payments) allPayments.push(...i.payments);
        }
        if (allPayments.length > 0) await tx.payment.createMany({ data: allPayments });

      });

      res.status(200).json({ message: 'Database berhasil dipulihkan.' });
    } catch (error) {
      console.error('Restore Error:', error);
      res.status(500).json({ error: 'Gagal memulihkan database. Cek apakah ada masalah relasi ID.' });
    }
  }
}

export const backupController = new BackupController();
