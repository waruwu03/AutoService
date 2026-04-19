// src/controllers/invoice.controller.ts

import { Request, Response, NextFunction } from 'express';
import { invoiceService } from '../services/invoice.service';
import {
  createInvoiceSchema,
  recordPaymentSchema,
} from '../schemas/invoice.schema';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class InvoiceController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await invoiceService.findAll(req.query as any);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await invoiceService.findById((req.params.id as string));
      sendSuccess(res, invoice);
    } catch (error) {
      next(error);
    }
  }

  async createFromWorkOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createInvoiceSchema.parse(req.body);
      const invoice = await invoiceService.createFromWorkOrder(
        data.workOrderId,
        req.user!.userId,
        data.dueDays
      );
      sendCreated(res, invoice, 'Invoice created');
    } catch (error) {
      next(error);
    }
  }

  async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const data = recordPaymentSchema.parse(req.body);
      const payment = await invoiceService.recordPayment(
        data.invoiceId,
        data.amount,
        data.paymentMethod,
        data.referenceNumber || null,
        req.user!.userId
      );
      sendCreated(res, payment, 'Payment recorded');
    } catch (error) {
      next(error);
    }
  }

  async getOverdue(req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = await invoiceService.getOverdueInvoices();
      sendSuccess(res, invoices);
    } catch (error) {
      next(error);
    }
  }
}

export const invoiceController = new InvoiceController();
