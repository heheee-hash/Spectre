import { z } from "zod";

export const deliveryItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive("Quantity must be greater than zero"),
});

export const deliveryCreateSchema = z.object({
  sourceId: z.string().cuid("Source location required"),
  customerId: z.string().optional().nullable(),
  notes: z.string().optional(),
  items: z.array(deliveryItemSchema).min(1, "At least one item is required"),
});

export const deliveryUpdateSchema = deliveryCreateSchema.partial();
