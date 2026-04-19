// src/schemas/vehicle.schema.ts

import { z } from 'zod';

export const createVehicleSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  licensePlate: z.string().min(1, 'License plate is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  vehicleType: z
    .enum(['MOBIL', 'MOTOR', 'TRUCK', 'BUS', 'LAINNYA'])
    .default('MOBIL'),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  vin: z.string().optional().nullable(),
  engineNumber: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  fuelType: z.string().optional().nullable(),
  lastOdometer: z.number().int().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
