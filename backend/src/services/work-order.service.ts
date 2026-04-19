// src/services/work-order.service.ts

import { prisma } from '../config/database.config';
import { WorkOrderStatus, MovementType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { CreateWorkOrderInput } from '../schemas/work-order.schema';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { PaginationQuery } from '../types/common.types';

export class WorkOrderService {
  // Generate unique order number
  async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const lastOrder = await prisma.workOrder.findFirst({
      where: {
        orderNumber: {
          startsWith: `WO-${dateStr}`,
        },
      },
      orderBy: { orderNumber: 'desc' },
    });

    let sequence = 1;
    if (lastOrder) {
      const parts = lastOrder.orderNumber.split('-');
      const lastSeq = parseInt(parts[parts.length - 1]);
      sequence = lastSeq + 1;
    }

    return `WO-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  }

  // List work orders with pagination
  async findAll(query: PaginationQuery & { status?: string }) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        {
          customer: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
        {
          vehicle: {
            licensePlate: { contains: query.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          vehicle: {
            select: {
              id: true,
              licensePlate: true,
              brand: true,
              model: true,
            },
          },
          assignedMechanic: { select: { id: true, name: true } },
        },
      }),
      prisma.workOrder.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  // Get single work order with all details
  async findById(id: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        assignedMechanic: {
          select: { id: true, name: true, phone: true, email: true },
        },
        services: {
          include: {
            service: true,
            performedBy: { select: { id: true, name: true } },
          },
        },
        spareparts: {
          include: {
            sparepart: { select: { id: true, code: true, name: true, unit: true } },
          },
        },
        invoices: true,
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    return workOrder;
  }

  // Create new work order
  async create(data: CreateWorkOrderInput, userId: string) {
    const orderNumber = await this.generateOrderNumber();

    return prisma.workOrder.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        priority: data.priority || 'NORMAL',
        assignedMechanicId: data.assignedMechanicId,
        odometerIn: data.odometerIn,
        fuelLevel: data.fuelLevel,
        customerComplaints: data.customerComplaints,
        estimatedCompletion: data.estimatedCompletion
          ? new Date(data.estimatedCompletion)
          : undefined,
        internalNotes: data.internalNotes,
        createdById: userId,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });
  }

  // Add service to work order
  async addService(
    workOrderId: string,
    serviceId: string,
    quantity: number = 1,
    discount: number = 0
  ) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (['COMPLETED', 'INVOICED', 'CANCELLED'].includes(workOrder.status)) {
      throw new AppError(
        'Cannot modify completed/invoiced work order',
        400
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    const totalPrice =
      Number(service.basePrice) * quantity * (1 - discount / 100);

    const woService = await prisma.workOrderService.create({
      data: {
        workOrderId,
        serviceId,
        quantity,
        unitPrice: service.basePrice,
        discountPercent: discount,
        totalPrice,
      },
    });

    // Recalculate totals
    await this.recalculateTotals(workOrderId);

    return woService;
  }

  // Add sparepart to work order (with stock deduction)
  async addSparepart(
    workOrderId: string,
    sparepartId: string,
    quantity: number,
    discount: number = 0,
    userId: string
  ) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (['COMPLETED', 'INVOICED', 'CANCELLED'].includes(workOrder.status)) {
      throw new AppError(
        'Cannot modify completed/invoiced work order',
        400
      );
    }

    const sparepart = await prisma.sparepart.findUnique({
      where: { id: sparepartId },
    });

    if (!sparepart) {
      throw new AppError('Sparepart not found', 404);
    }

    if (sparepart.stockQuantity < quantity) {
      throw new AppError(
        `Insufficient stock. Available: ${sparepart.stockQuantity}`,
        400
      );
    }

    const totalPrice =
      Number(sparepart.sellPrice) * quantity * (1 - discount / 100);

    // Use transaction for stock management
    const result = await prisma.$transaction(async (tx) => {
      // Create work order sparepart
      const woPart = await tx.workOrderSparepart.create({
        data: {
          workOrderId,
          sparepartId,
          quantity,
          unitPrice: sparepart.sellPrice,
          discountPercent: discount,
          totalPrice,
        },
      });

      // Update stock
      const newStock = sparepart.stockQuantity - quantity;
      await tx.sparepart.update({
        where: { id: sparepartId },
        data: { stockQuantity: newStock },
      });

      // Create stock movement
      await tx.stockMovement.create({
        data: {
          sparepartId,
          movementType: MovementType.SALE,
          quantity: -quantity,
          referenceType: 'work_order',
          referenceId: workOrderId,
          stockBefore: sparepart.stockQuantity,
          stockAfter: newStock,
          unitCost: sparepart.sellPrice,
          totalCost: totalPrice,
          createdById: userId,
        },
      });

      return woPart;
    });

    // Recalculate totals
    await this.recalculateTotals(workOrderId);

    return result;
  }

  // Remove service from work order
  async removeService(workOrderId: string, serviceId: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (['COMPLETED', 'INVOICED', 'CANCELLED'].includes(workOrder.status)) {
      throw new AppError('Cannot modify completed/invoiced work order', 400);
    }

    await prisma.workOrderService.deleteMany({
      where: { workOrderId, serviceId },
    });

    await this.recalculateTotals(workOrderId);
  }

  // Update work order status
  async updateStatus(
    workOrderId: string,
    newStatus: WorkOrderStatus,
    userId: string
  ) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    // Validate status transitions
    const validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      DRAFT: ['PENDING', 'CANCELLED'],
      PENDING: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: [
        'WAITING_PARTS',
        'QUALITY_CHECK',
        'COMPLETED',
        'CANCELLED',
      ],
      WAITING_PARTS: ['IN_PROGRESS', 'CANCELLED'],
      QUALITY_CHECK: ['IN_PROGRESS', 'COMPLETED'],
      COMPLETED: ['INVOICED'],
      INVOICED: [],
      CANCELLED: [],
    };

    if (!validTransitions[workOrder.status].includes(newStatus)) {
      throw new AppError(
        `Cannot transition from ${workOrder.status} to ${newStatus}`,
        400
      );
    }

    const updateData: any = {
      status: newStatus,
      updatedById: userId,
    };

    if (newStatus === 'COMPLETED') {
      updateData.actualCompletion = new Date();
    }

    return prisma.workOrder.update({
      where: { id: workOrderId },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true } },
        vehicle: {
          select: { id: true, licensePlate: true, brand: true, model: true },
        },
      },
    });
  }

  // Assign mechanic to work order
  async assignMechanic(workOrderId: string, mechanicId: string) {
    const mechanic = await prisma.user.findUnique({
      where: { id: mechanicId },
    });

    if (!mechanic || mechanic.role !== 'MEKANIK') {
      throw new AppError('Mechanic not found', 404);
    }

    return prisma.workOrder.update({
      where: { id: workOrderId },
      data: { assignedMechanicId: mechanicId },
      include: {
        assignedMechanic: { select: { id: true, name: true } },
      },
    });
  }

  // Recalculate work order totals
  async recalculateTotals(workOrderId: string) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: {
        services: true,
        spareparts: true,
      },
    });

    if (!workOrder) return;

    const totalServiceCost = workOrder.services.reduce(
      (sum, s) => sum + Number(s.totalPrice),
      0
    );

    const totalPartsCost = workOrder.spareparts.reduce(
      (sum, p) => sum + Number(p.totalPrice),
      0
    );

    const subtotal = totalServiceCost + totalPartsCost;
    const discountAmount =
      subtotal * (Number(workOrder.discountPercent) / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (Number(workOrder.taxPercent) / 100);
    const grandTotal = afterDiscount + taxAmount;

    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        totalServiceCost,
        totalPartsCost,
        discountAmount,
        taxAmount,
        grandTotal,
      },
    });
  }
}

export const workOrderService = new WorkOrderService();
