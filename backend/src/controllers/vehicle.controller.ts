// src/controllers/vehicle.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';
import {
  createVehicleSchema,
  updateVehicleSchema,
} from '../schemas/vehicle.schema';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from '../utils/response.util';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class VehicleController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(
        req.query as any
      );

      const where: any = { isActive: true };
      if ((req.query.search as string) as string) {
        where.OR = [
          {
            licensePlate: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
          {
            model: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.vehicle.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            customer: { select: { id: true, name: true, phone: true } },
          },
        }),
        prisma.vehicle.count({ where }),
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
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: (req.params.id as string) },
        include: {
          customer: true,
          _count: { select: { workOrders: true } },
        },
      });

      if (!vehicle) {
        sendNotFound(res, 'Vehicle');
        return;
      }

      sendSuccess(res, vehicle);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createVehicleSchema.parse(req.body);
      const vehicle = await prisma.vehicle.create({
        data,
        include: { customer: { select: { id: true, name: true } } },
      });
      sendCreated(res, vehicle);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateVehicleSchema.parse(req.body);
      const vehicle = await prisma.vehicle.update({
        where: { id: (req.params.id as string) },
        data,
      });
      sendSuccess(res, vehicle, 'Vehicle updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.vehicle.update({
        where: { id: (req.params.id as string) },
        data: { isActive: false },
      });
      sendSuccess(res, null, 'Vehicle deactivated');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const workOrders = await prisma.workOrder.findMany({
        where: {
          vehicleId: (req.params.id as string),
          status: { in: ['COMPLETED', 'INVOICED'] },
        },
        include: {
          assignedMechanic: { select: { name: true } },
          services: { include: { service: { select: { name: true } } } },
        },
        orderBy: { receivedAt: 'desc' },
      });
      sendSuccess(res, workOrders);
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
