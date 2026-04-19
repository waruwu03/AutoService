// src/controllers/inventory.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';
import { inventoryService } from '../services/inventory.service';
import {
  createSparepartSchema,
  updateSparepartSchema,
  adjustStockSchema,
  createSupplierSchema,
  updateSupplierSchema,
} from '../schemas/inventory.schema';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from '../utils/response.util';

export class InventoryController {
  // Sparepart endpoints
  async findAllSpareparts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inventoryService.findAllSpareparts(
        req.query as any
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findSparepartById(req: Request, res: Response, next: NextFunction) {
    try {
      const sparepart = await inventoryService.findSparepartById(
        (req.params.id as string)
      );
      sendSuccess(res, sparepart);
    } catch (error) {
      next(error);
    }
  }

  async createSparepart(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSparepartSchema.parse(req.body);
      const sparepart = await prisma.sparepart.create({ data: data as any });
      sendCreated(res, sparepart);
    } catch (error) {
      next(error);
    }
  }

  async updateSparepart(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateSparepartSchema.parse(req.body);
      const sparepart = await prisma.sparepart.update({
        where: { id: (req.params.id as string) },
        data: data as any,
      });
      sendSuccess(res, sparepart, 'Sparepart updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteSparepart(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.sparepart.update({
        where: { id: (req.params.id as string) },
        data: { isActive: false },
      });
      sendSuccess(res, null, 'Sparepart deactivated');
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const data = adjustStockSchema.parse(req.body);
      const result = await inventoryService.adjustStock(
        (req.params.id as string),
        data.quantity,
        data.type,
        data.reason,
        req.user!.userId
      );
      sendSuccess(res, result, 'Stock adjusted');
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await inventoryService.getLowStockItems();
      sendSuccess(res, items);
    } catch (error) {
      next(error);
    }
  }

  async getStockMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inventoryService.getStockMovements(
        (req.params.id as string),
        req.query as any
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  // Supplier endpoints
  async findAllSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inventoryService.findAllSuppliers(
        req.query as any
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await prisma.supplier.findUnique({
        where: { id: (req.params.id as string) },
        include: {
          spareparts: {
            where: { isActive: true },
            select: { id: true, code: true, name: true, stockQuantity: true },
          },
        },
      });

      if (!supplier) {
        sendNotFound(res, 'Supplier');
        return;
      }

      sendSuccess(res, supplier);
    } catch (error) {
      next(error);
    }
  }

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSupplierSchema.parse(req.body);
      const supplier = await prisma.supplier.create({ data: data as any });
      sendCreated(res, supplier);
    } catch (error) {
      next(error);
    }
  }

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateSupplierSchema.parse(req.body);
      const supplier = await prisma.supplier.update({
        where: { id: (req.params.id as string) },
        data: data as any,
      });
      sendSuccess(res, supplier, 'Supplier updated');
    } catch (error) {
      next(error);
    }
  }

  async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.supplier.update({
        where: { id: (req.params.id as string) },
        data: { isActive: false },
      });
      sendSuccess(res, null, 'Supplier deactivated');
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
