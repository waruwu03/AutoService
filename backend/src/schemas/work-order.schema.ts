// src/schemas/work-order.schema.ts

import { z } from 'zod';

export const createWorkOrderSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  assignedMechanicId: z.string().uuid().optional().nullable(),
  odometerIn: z.number().int().min(0).optional().nullable(),
  fuelLevel: z.string().optional().nullable(),
  customerComplaints: z.string().optional().nullable(),
  estimatedCompletion: z.string().datetime().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
});

export const updateWorkOrderSchema = createWorkOrderSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum([
    'DRAFT',
    'PENDING',
    'IN_PROGRESS',
    'WAITING_PARTS',
    'QUALITY_CHECK',
    'COMPLETED',
    'INVOICED',
    'CANCELLED',
  ]),
});

export const addServiceSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  quantity: z.number().int().min(1).default(1),
  discountPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional().nullable(),
});

export const addSparepartSchema = z.object({
  sparepartId: z.string().uuid('Invalid sparepart ID'),
  quantity: z.number().int().min(1),
  discountPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional().nullable(),
});

export const assignMechanicSchema = z.object({
  mechanicId: z.string().uuid('Invalid mechanic ID'),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type AddServiceInput = z.infer<typeof addServiceSchema>;
export type AddSparepartInput = z.infer<typeof addSparepartSchema>;
