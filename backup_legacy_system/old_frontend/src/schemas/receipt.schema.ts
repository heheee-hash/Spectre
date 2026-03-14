import { z } from "zod";

export const receiptItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive("Quantity must be greater than zero"),
});

export const receiptCreateSchema = z.object({
  destinationId: z.string().cuid("Destination location required"),
  vendorId: z.string().optional().nullable(),
  notes: z.string().optional(),
  items: z.array(receiptItemSchema).min(1, "At least one item is required"),
});

export const receiptUpdateSchema = receiptCreateSchema.partial();
