// src/utils/response.util.ts

import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: Array<{ field: string; message: string }>
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
}

export function sendNotFound(
  res: Response,
  resource: string = 'Resource'
): Response {
  return sendError(res, `${resource} not found`, 404);
}

export function sendUnauthorized(
  res: Response,
  message: string = 'Authentication required'
): Response {
  return sendError(res, message, 401);
}

export function sendForbidden(
  res: Response,
  message: string = 'Insufficient permissions'
): Response {
  return sendError(res, message, 403);
}
