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
  sendError,
} from '../utils/response.util';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class CustomerController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(
        req.query as any
      );

      const where: any = { isActive: true };
      if ((req.query.search as string) as string) {
        where.OR = [
          {
            name: {
              contains: (req.query.search as string) as string,
            },
          },
          {
            phone: {
              contains: (req.query.search as string) as string,
            },
          },
          {
            email: {
              contains: (req.query.search as string) as string,
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
            vehicles: true,
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
      
      // Check for duplicates
      const existing = await prisma.customer.findFirst({
        where: {
          OR: [
            { phone: data.phone },
            ...(data.email ? [{ email: data.email }] : [])
          ]
        }
      });

      if (existing) {
        return sendError(res, 'Pelanggan dengan nomor HP atau Email ini sudah terdaftar', 409);
      }

      const customer = await prisma.customer.create({ data });
      sendCreated(res, customer);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = updateCustomerSchema.parse(req.body);

      if (data.phone || data.email) {
        const existing = await prisma.customer.findFirst({
          where: {
            id: { not: id },
            OR: [
              ...(data.phone ? [{ phone: data.phone }] : []),
              ...(data.email ? [{ email: data.email }] : [])
            ]
          }
        });

        if (existing) {
          return sendError(res, 'Nomor HP atau Email ini sudah terdaftar pada pelanggan lain', 409);
        }
      }

      const customer = await prisma.customer.update({
        where: { id },
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
