import { z } from "zod";

export const transferItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive("Quantity must be greater than zero"),
});

export const transferCreateSchema = z.object({
  sourceId: z.string().cuid("Source location required"),
  destinationId: z.string().cuid("Destination location required"),
  notes: z.string().optional(),
  items: z.array(transferItemSchema).min(1, "At least one item is required"),
});

export const transferUpdateSchema = transferCreateSchema.partial();
