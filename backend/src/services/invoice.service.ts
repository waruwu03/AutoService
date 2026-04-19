// src/services/invoice.service.ts

import { prisma } from '../config/database.config';
import { InvoiceStatus, WorkOrderStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { PaginationQuery } from '../types/common.types';

export class InvoiceService {
  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV-${dateStr}`,
        },
      },
      orderBy: { invoiceNumber: 'desc' },
    });

    let sequence = 1;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      const lastSeq = parseInt(parts[parts.length - 1]);
      sequence = lastSeq + 1;
    }

    return `INV-${dateStr}-${sequence.toString().padStart(3, '0')}`;
  }

  async findAll(query: PaginationQuery & { status?: string }) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query);

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
        {
          customer: {
            name: { contains: query.search, mode: 'insensitive' },
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          workOrder: { select: { id: true, orderNumber: true } },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      data,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        workOrder: {
          include: {
            vehicle: true,
            services: { include: { service: true } },
            spareparts: { include: { sparepart: true } },
          },
        },
        payments: {
          include: {
            receivedBy: { select: { id: true, name: true } },
          },
          orderBy: { paymentDate: 'desc' },
        },
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    return invoice;
  }

  async createFromWorkOrder(
    workOrderId: string,
    userId: string,
    dueDays: number = 30
  ) {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { customer: true },
    });

    if (!workOrder) {
      throw new AppError('Work order not found', 404);
    }

    if (workOrder.status !== WorkOrderStatus.COMPLETED) {
      throw new AppError('Work order must be completed first', 400);
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findFirst({
      where: { workOrderId },
    });

    if (existingInvoice) {
      throw new AppError(
        'Invoice already exists for this work order',
        400
      );
    }

    const invoiceNumber = await this.generateInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);

    const subtotal =
      Number(workOrder.totalServiceCost) + Number(workOrder.totalPartsCost);

    const invoice = await prisma.$transaction(async (tx) => {
      // Create invoice
      const inv = await tx.invoice.create({
        data: {
          invoiceNumber,
          workOrderId,
          customerId: workOrder.customerId,
          subtotal,
          discountAmount: workOrder.discountAmount,
          taxAmount: workOrder.taxAmount,
          grandTotal: workOrder.grandTotal,
          amountDue: workOrder.grandTotal,
          dueDate,
          createdById: userId,
        },
      });

      // Update work order status
      await tx.workOrder.update({
        where: { id: workOrderId },
        data: { status: WorkOrderStatus.INVOICED },
      });

      // Update customer outstanding balance
      await tx.customer.update({
        where: { id: workOrder.customerId },
        data: {
          outstandingBalance: {
            increment: workOrder.grandTotal,
          },
        },
      });

      return inv;
    });

    return invoice;
  }

  async recordPayment(
    invoiceId: string,
    amount: number,
    paymentMethod: string,
    referenceNumber: string | null,
    userId: string
  ) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    if (['PAID', 'CANCELLED', 'REFUNDED'].includes(invoice.status)) {
      throw new AppError('Invoice cannot accept payments', 400);
    }

    if (amount > Number(invoice.amountDue)) {
      throw new AppError('Payment amount exceeds amount due', 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount,
          paymentMethod: paymentMethod as any,
          referenceNumber,
          receivedById: userId,
        },
      });

      // Update invoice
      const newAmountPaid = Number(invoice.amountPaid) + amount;
      const newAmountDue = Number(invoice.amountDue) - amount;

      let newStatus: InvoiceStatus = invoice.status;
      let paidDate = null;

      if (newAmountDue <= 0) {
        newStatus = InvoiceStatus.PAID;
        paidDate = new Date();
      } else if (newAmountPaid > 0) {
        newStatus = InvoiceStatus.PARTIAL;
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus,
          paidDate,
        },
      });

      // Update customer outstanding balance
      await tx.customer.update({
        where: { id: invoice.customerId },
        data: {
          outstandingBalance: {
            decrement: amount,
          },
        },
      });

      return payment;
    });

    return result;
  }

  async getOverdueInvoices() {
    return prisma.invoice.findMany({
      where: {
        status: { in: ['SENT', 'PARTIAL'] },
        dueDate: { lt: new Date() },
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        workOrder: { select: { id: true, orderNumber: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }
}

export const invoiceService = new InvoiceService();
