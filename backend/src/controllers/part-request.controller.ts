// src/controllers/part-request.controller.ts

import { Request, Response, NextFunction } from 'express';
import { partRequestService } from '../services/part-request.service';
import { sendSuccess } from '../utils/response.util';

export class PartRequestController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await partRequestService.findAll(req.query as any);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await partRequestService.create({
        ...req.body,
        userId,
      });
      sendSuccess(res, result, 'Request created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await partRequestService.findById(req.params.id as string);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await partRequestService.approve(req.params.id as string, userId);
      sendSuccess(res, result, 'Request approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { reason } = req.body;
      const result = await partRequestService.reject(req.params.id as string, userId, reason);
      sendSuccess(res, result, 'Request rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  async fulfill(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await partRequestService.fulfill(req.params.id as string, userId);
      sendSuccess(res, result, 'Request fulfilled successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const partRequestController = new PartRequestController();
