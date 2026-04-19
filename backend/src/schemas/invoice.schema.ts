// src/schemas/invoice.schema.ts

import { z } from 'zod';

export const createInvoiceSchema = z.object({
  workOrderId: z.string().uuid('Invalid work order ID'),
  dueDays: z.number().int().min(0).default(30),
});

export const recordPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum([
    'CASH',
    'TRANSFER',
    'DEBIT_CARD',
    'CREDIT_CARD',
    'QRIS',
    'E_WALLET',
    'CREDIT',
  ]),
  referenceNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
