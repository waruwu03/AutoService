// src/controllers/work-order.controller.ts

import { Request, Response, NextFunction } from 'express';
import { workOrderService } from '../services/work-order.service';
import {
  createWorkOrderSchema,
  updateStatusSchema,
  addServiceSchema,
  addSparepartSchema,
  assignMechanicSchema,
} from '../schemas/work-order.schema';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class WorkOrderController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await workOrderService.findAll(req.query as any);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const workOrder = await workOrderService.findById((req.params.id as string));
      sendSuccess(res, workOrder);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createWorkOrderSchema.parse(req.body);
      const workOrder = await workOrderService.create(data, req.user!.userId);
      sendCreated(res, workOrder, 'Work order created');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const workOrder = await workOrderService.updateStatus(
        (req.params.id as string),
        status as any,
        req.user!.userId
      );
      sendSuccess(res, workOrder, 'Status updated');
    } catch (error) {
      next(error);
    }
  }

  async assignMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const { mechanicId } = assignMechanicSchema.parse(req.body);
      const workOrder = await workOrderService.assignMechanic(
        (req.params.id as string),
        mechanicId
      );
      sendSuccess(res, workOrder, 'Mechanic assigned');
    } catch (error) {
      next(error);
    }
  }

  async addService(req: Request, res: Response, next: NextFunction) {
    try {
      const data = addServiceSchema.parse(req.body);
      const result = await workOrderService.addService(
        (req.params.id as string),
        data.serviceId,
        data.quantity,
        data.discountPercent
      );
      sendCreated(res, result, 'Service added to work order');
    } catch (error) {
      next(error);
    }
  }

  async removeService(req: Request, res: Response, next: NextFunction) {
    try {
      await workOrderService.removeService(
        (req.params.id as string),
        (req.params.serviceId as string)
      );
      sendSuccess(res, null, 'Service removed from work order');
    } catch (error) {
      next(error);
    }
  }

  async addSparepart(req: Request, res: Response, next: NextFunction) {
    try {
      const data = addSparepartSchema.parse(req.body);
      const result = await workOrderService.addSparepart(
        (req.params.id as string),
        data.sparepartId,
        data.quantity,
        data.discountPercent,
        req.user!.userId
      );
      sendCreated(res, result, 'Sparepart added to work order');
    } catch (error) {
      next(error);
    }
  }
}

export const workOrderController = new WorkOrderController();
