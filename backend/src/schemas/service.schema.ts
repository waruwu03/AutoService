// src/schemas/service.schema.ts

import { z } from 'zod';

export const createServiceSchema = z.object({
  code: z.string().min(1, 'Service code is required'),
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional().nullable(),
  category: z.enum([
    'SERVIS_BERKALA',
    'PERBAIKAN_MESIN',
    'PERBAIKAN_TRANSMISI',
    'KELISTRIKAN',
    'AC_COOLING',
    'BODY_REPAIR',
    'KAKI_KAKI',
    'DETAILING',
    'LAINNYA',
  ]),
  basePrice: z.number().min(0).default(0),
  estimatedDuration: z.number().int().min(0).optional().nullable(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
