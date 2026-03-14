import { z } from "zod";

export const adjustmentItemSchema = z.object({
  productId: z.string().cuid(),
  countedQty: z.number().min(0, "Counted quantity cannot be negative"),
  systemQty: z.number().default(0), // Normally fetched from DB, but client can pass it for display/diff
});

export const adjustmentCreateSchema = z.object({
  locationId: z.string().cuid("Location required"),
  reason: z.string().optional(),
  items: z.array(adjustmentItemSchema).min(1, "At least one item is required"),
});

export const adjustmentUpdateSchema = adjustmentCreateSchema.partial();
