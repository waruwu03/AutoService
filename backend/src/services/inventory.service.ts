// src/services/inventory.service.ts

import { prisma } from '../config/database.config';
import { MovementType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { PaginationQuery } from '../types/common.types';

export class InventoryService {
  async findAllSpareparts(
    query: PaginationQuery & { category?: string; lowStock?: boolean }
  ) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = { isActive: true };
    if (query.category) {
      where.category = query.category;
    }
    if (query.lowStock) {
      where.stockQuantity = { lte: 5 };
      // Use raw comparison for min_stock
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.sparepart.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          supplier: { select: { id: true, name: true } },
        },
      }),
      prisma.sparepart.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  async findSparepartById(id: string) {
    const sparepart = await prisma.sparepart.findUnique({
      where: { id },
      include: {
        supplier: true,
        stockMovements: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!sparepart) {
      throw new AppError('Sparepart not found', 404);
    }

    return sparepart;
  }

  async adjustStock(
    sparepartId: string,
    quantity: number,
    type: 'in' | 'out',
    reason: string,
    userId: string
  ) {
    const sparepart = await prisma.sparepart.findUnique({
      where: { id: sparepartId },
    });

    if (!sparepart) {
      throw new AppError('Sparepart not found', 404);
    }

    const adjustedQty = type === 'in' ? quantity : -quantity;
    const newStock = sparepart.stockQuantity + adjustedQty;

    if (newStock < 0) {
      throw new AppError('Resulting stock cannot be negative', 400);
    }

    return prisma.$transaction(async (tx) => {
      await tx.sparepart.update({
        where: { id: sparepartId },
        data: { stockQuantity: newStock },
      });

      await tx.stockMovement.create({
        data: {
          sparepartId,
          movementType:
            type === 'in'
              ? MovementType.ADJUSTMENT_IN
              : MovementType.ADJUSTMENT_OUT,
          quantity: adjustedQty,
          referenceType: 'adjustment',
          stockBefore: sparepart.stockQuantity,
          stockAfter: newStock,
          notes: reason,
          createdById: userId,
        },
      });

      return { newStock };
    });
  }

  async purchaseStock(
    sparepartId: string,
    quantity: number,
    unitCost: number,
    userId: string
  ) {
    const sparepart = await prisma.sparepart.findUnique({
      where: { id: sparepartId },
    });

    if (!sparepart) {
      throw new AppError('Sparepart not found', 404);
    }

    const newStock = sparepart.stockQuantity + quantity;
    const totalCost = quantity * unitCost;

    // Calculate new average buy price
    const currentValue =
      sparepart.stockQuantity * Number(sparepart.buyPrice);
    const newValue = currentValue + totalCost;
    const newAvgPrice = newStock > 0 ? newValue / newStock : unitCost;

    return prisma.$transaction(async (tx) => {
      await tx.sparepart.update({
        where: { id: sparepartId },
        data: {
          stockQuantity: newStock,
          buyPrice: newAvgPrice,
        },
      });

      await tx.stockMovement.create({
        data: {
          sparepartId,
          movementType: MovementType.PURCHASE,
          quantity,
          referenceType: 'purchase',
          stockBefore: sparepart.stockQuantity,
          stockAfter: newStock,
          unitCost,
          totalCost,
          createdById: userId,
        },
      });

      return { newStock, newAvgPrice };
    });
  }

  async getLowStockItems() {
    // Use raw query to compare stock_quantity with min_stock
    const items = await prisma.$queryRaw<any[]>`
      SELECT s.*, sup.name as supplier_name, sup.phone as supplier_phone
      FROM spareparts s
      LEFT JOIN suppliers sup ON sup.id = s.supplier_id
      WHERE s.stock_quantity <= s.min_stock 
      AND s.is_active = true
      ORDER BY s.stock_quantity ASC
    `;

    return items;
  }

  async getStockMovements(
    sparepartId: string,
    query: PaginationQuery
  ) {
    const { page, limit, skip } = parsePagination(query);

    const where = { sparepartId };

    const [data, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } },
        },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  // Supplier methods
  async findAllSuppliers(query: PaginationQuery) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.supplier.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }
}

export const inventoryService = new InventoryService();
