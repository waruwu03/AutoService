// src/services/part-request.service.ts

import { prisma } from '../config/database.config';
import { MovementType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { PaginationQuery } from '../types/common.types';
import { workOrderService } from './work-order.service';

// Locally define enum to avoid missing export error if prisma generate hasn't run
export enum PartRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED'
}

export class PartRequestService {
  async findAll(query: PaginationQuery & { status?: string; requestedById?: string }) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.requestedById) {
      where.requestedById = query.requestedById;
    }

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search } },
        { workOrder: { orderNumber: { contains: query.search } } },
        { workOrder: { vehicle: { licensePlate: { contains: query.search } } } },
      ];
    }

    const [data, total] = await Promise.all([
      (prisma as any).partRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          workOrder: {
            include: {
              vehicle: { select: { licensePlate: true, brand: true, model: true } },
              customer: { select: { name: true } },
            },
          },
          requestedBy: { select: { id: true, name: true } },
          items: {
            include: {
              sparepart: { select: { id: true, code: true, name: true, stockQuantity: true } },
            },
          },
        },
      }),
      (prisma as any).partRequest.count({ where }),
    ]);

    // Map to the format expected by frontend
    const mappedData = data.map((request: any) => ({
      id: request.id,
      spk_number: request.workOrder?.orderNumber || request.orderNumber,
      customer_name: request.workOrder?.customer?.name || '-',
      vehicle_plate: request.workOrder?.vehicle?.licensePlate || '-',
      vehicle_info: request.workOrder?.vehicle ? `${request.workOrder.vehicle.brand} ${request.workOrder.vehicle.model}` : '-',
      mekanik_name: request.requestedBy.name,
      status: request.status.toLowerCase(),
      created_at: request.createdAt,
      items: request.items.map((item: any) => ({
        id: item.id,
        sparepart_name: item.sparepart.name,
        sparepart_code: item.sparepart.code,
        quantity: item.quantity,
        available_stock: item.sparepart.stockQuantity,
      })),
    }));

    return {
      data: mappedData,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  async create(data: {
    workOrderId?: string;
    items: { sparepartId: string; quantity: number; notes?: string }[];
    userId: string;
    notes?: string;
  }) {
    // Generate order number: REQ-YYYYMMDD-XXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await (prisma as any).partRequest.count({
      where: {
        createdAt: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        },
      },
    });
    const orderNumber = `REQ-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

    return (prisma as any).partRequest.create({
      data: {
        orderNumber,
        workOrderId: data.workOrderId,
        requestedById: data.userId,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            sparepartId: item.sparepartId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findById(id: string) {
    const request = await (prisma as any).partRequest.findUnique({
      where: { id },
      include: {
        workOrder: {
          include: {
            vehicle: true,
          },
        },
        requestedBy: true,
        approvedBy: true,
        items: {
          include: {
            sparepart: true,
          },
        },
      },
    });

    if (!request) {
      throw new AppError('Part request not found', 404);
    }

    return request;
  }

  async approve(id: string, userId: string) {
    const request = await (prisma as any).partRequest.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!request) {
      throw new AppError('Part request not found', 404);
    }

    if (request.status !== PartRequestStatus.PENDING) {
      throw new AppError('Request is already processed', 400);
    }

    // Check stock for each item
    for (const item of request.items) {
      const sparepart = await prisma.sparepart.findUnique({
        where: { id: item.sparepartId },
      });

      if (!sparepart || sparepart.stockQuantity < item.quantity) {
        throw new AppError(`Insufficient stock for sparepart: ${sparepart?.name || item.sparepartId}`, 400);
      }
    }

    return prisma.$transaction(async (tx) => {
      // Update request status
      const updatedRequest = await (tx as any).partRequest.update({
        where: { id },
        data: {
          status: PartRequestStatus.APPROVED,
          approvedById: userId,
        },
      });

      // Deduct stock and create movements/work order items for each item
      for (const item of request.items) {
        const sparepart = await tx.sparepart.findUnique({
          where: { id: item.sparepartId },
        });

        if (!sparepart) continue;

        const newStock = sparepart.stockQuantity - item.quantity;

        await tx.sparepart.update({
          where: { id: item.sparepartId },
          data: { stockQuantity: newStock },
        });

        await tx.stockMovement.create({
          data: {
            sparepartId: item.sparepartId,
            movementType: MovementType.ADJUSTMENT_OUT,
            quantity: -item.quantity,
            referenceType: 'part_request',
            referenceId: id,
            stockBefore: sparepart.stockQuantity,
            stockAfter: newStock,
            notes: `Approved request ${request.orderNumber}`,
            createdById: userId,
          },
        });

          // If linked to a work order, add to work order items
        if (request.workOrderId) {
          await (tx as any).workOrderSparepart.create({
            data: {
              workOrderId: request.workOrderId,
              sparepartId: item.sparepartId,
              quantity: item.quantity,
              unitPrice: sparepart.sellPrice,
              totalPrice: Number(sparepart.sellPrice) * item.quantity,
              notes: item.notes || `From request ${request.orderNumber}`,
            },
          });
        }
      }

      // If linked to a work order, recalculate totals after all items are added
      if (request.workOrderId) {
        await workOrderService.recalculateTotals(request.workOrderId);
      }

      return updatedRequest;
    });
  }

  async reject(id: string, userId: string, reason: string) {
    const request = await (prisma as any).partRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new AppError('Part request not found', 404);
    }

    if (request.status !== PartRequestStatus.PENDING) {
      throw new AppError('Request is already processed', 400);
    }

    return (prisma as any).partRequest.update({
      where: { id },
      data: {
        status: PartRequestStatus.REJECTED,
        approvedById: userId,
        rejectReason: reason,
      },
    });
  }

  async fulfill(id: string, userId: string) {
    const request = await (prisma as any).partRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new AppError('Part request not found', 404);
    }

    if (request.status !== PartRequestStatus.APPROVED) {
      throw new AppError('Only APPROVED requests can be fulfilled/received', 400);
    }

    // Usually only the requester can confirm receipt, but Admin can also do it
    if (request.requestedById !== userId) {
      const user = await (prisma as any).user.findUnique({ where: { id: userId } });
      if (!user || user.role !== 'ADMIN') {
        throw new AppError('You are not authorized to fulfill this request', 403);
      }
    }

    return (prisma as any).partRequest.update({
      where: { id },
      data: {
        status: PartRequestStatus.FULFILLED,
        updatedAt: new Date(),
      },
    });
  }
}

export const partRequestService = new PartRequestService();
