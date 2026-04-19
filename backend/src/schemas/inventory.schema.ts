// src/schemas/inventory.schema.ts

import { z } from 'zod';

export const createSparepartSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  category: z.enum([
    'OLI_PELUMAS',
    'FILTER',
    'BRAKE',
    'SUSPENSION',
    'ENGINE',
    'TRANSMISSION',
    'ELECTRICAL',
    'BODY',
    'AC',
    'TIRE_WHEEL',
    'ACCESSORIES',
    'CONSUMABLE',
    'LAINNYA',
  ]),
  brand: z.string().optional().nullable(),
  unit: z.string().default('PCS'),
  buyPrice: z.number().min(0).default(0),
  sellPrice: z.number().min(0).default(0),
  stockQuantity: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(5),
  maxStock: z.number().int().min(0).optional().nullable(),
  location: z.string().optional().nullable(),
  supplierId: z.string().uuid().optional().nullable(),
});

export const updateSparepartSchema = createSparepartSchema.partial();

export const adjustStockSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  type: z.enum(['in', 'out']),
  reason: z.string().min(1, 'Reason is required'),
});

export const createSupplierSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  paymentTerms: z.number().int().min(0).default(30),
  notes: z.string().optional().nullable(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSparepartInput = z.infer<typeof createSparepartSchema>;
export type UpdateSparepartInput = z.infer<typeof updateSparepartSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
