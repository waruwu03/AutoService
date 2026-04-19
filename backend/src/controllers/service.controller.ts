// src/controllers/service.controller.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.config';
import {
  createServiceSchema,
  updateServiceSchema,
} from '../schemas/service.schema';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from '../utils/response.util';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class ServiceController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(
        req.query as any
      );

      const where: any = { isActive: true };
      if ((req.query.category as string) as string) {
        where.category = (req.query.category as string) as string;
      }
      if ((req.query.search as string) as string) {
        where.OR = [
          {
            name: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: (req.query.search as string) as string,
              mode: 'insensitive',
            },
          },
        ];
      }

      const [data, total] = await Promise.all([
        prisma.service.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.service.count({ where }),
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
      const service = await prisma.service.findUnique({
        where: { id: (req.params.id as string) },
      });

      if (!service) {
        sendNotFound(res, 'Service');
        return;
      }

      sendSuccess(res, service);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createServiceSchema.parse(req.body);
      const service = await prisma.service.create({ data: data as any });
      sendCreated(res, service);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateServiceSchema.parse(req.body);
      const service = await prisma.service.update({
        where: { id: (req.params.id as string) },
        data: data as any,
      });
      sendSuccess(res, service, 'Service updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.service.update({
        where: { id: (req.params.id as string) },
        data: { isActive: false },
      });
      sendSuccess(res, null, 'Service deactivated');
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = [
        'SERVIS_BERKALA',
        'PERBAIKAN_MESIN',
        'PERBAIKAN_TRANSMISI',
        'KELISTRIKAN',
        'AC_COOLING',
        'BODY_REPAIR',
        'KAKI_KAKI',
        'DETAILING',
        'LAINNYA',
      ];
      sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
