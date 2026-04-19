// src/controllers/customer.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../schemas/customer.schema';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from '../utils/response.util';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class CustomerController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(
        req.query as any
      );

      const where: any = {};
      if ((req.query.search as string) as string) {
        where.OR = [
          {
            name: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
        ];
      }
      if (req.query.type) {
        where.customerType = req.query.type;
      }

      const [data, total] = await Promise.all([
        prisma.customer.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            _count: { select: { vehicles: true, workOrders: true } },
          },
        }),
        prisma.customer.count({ where }),
      ]);

      sendSuccess(res, {
        data,
        pagination: createPaginationMeta(total, page, limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id: (req.params.id as string) },
        include: {
          vehicles: true,
          _count: { select: { workOrders: true, invoices: true } },
        },
      });

      if (!customer) {
        sendNotFound(res, 'Customer');
        return;
      }

      sendSuccess(res, customer);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCustomerSchema.parse(req.body);
      const customer = await prisma.customer.create({ data });
      sendCreated(res, customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCustomerSchema.parse(req.body);
      const customer = await prisma.customer.update({
        where: { id: (req.params.id as string) },
        data,
      });
      sendSuccess(res, customer, 'Customer updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.customer.update({
        where: { id: (req.params.id as string) },
        data: { isActive: false },
      });
      sendSuccess(res, null, 'Customer deactivated');
    } catch (error) {
      next(error);
    }
  }

  async getVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: { customerId: (req.params.id as string), isActive: true },
      });
      sendSuccess(res, vehicles);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const workOrders = await prisma.workOrder.findMany({
        where: { customerId: (req.params.id as string) },
        include: {
          vehicle: {
            select: { licensePlate: true, brand: true, model: true },
          },
          assignedMechanic: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      sendSuccess(res, workOrders);
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
