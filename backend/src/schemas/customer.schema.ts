// src/schemas/customer.schema.ts

import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z.string().min(8, 'Phone must be at least 8 characters'),
  address: z.string().optional().nullable(),
  customerType: z.enum(['PRIBADI', 'KORPORAT']).default('PRIBADI'),
  companyName: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  creditLimit: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
